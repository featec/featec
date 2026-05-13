import { Component , OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetadataService } from '../services/metadata.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  slides: NodeListOf<Element>;
  controls: NodeListOf<Element>;
  numOfSlides: number;
  slidingAT: number = 1300; // synchronize this with your SCSS variable
  slidingBlocked: boolean = false;
  pageTitle = "Get to Know the Featec Team and Its Values";

  constructor(private meta: Meta, private title: Title, private metadataService: MetadataService) {
  }
  
  ngOnInit() {

    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'We are committed to delivering top-notch business analysis, development, design, and more. Discover how our skilled professionals and strategic approach can help your business thrive.' }
    );
    this.metadataService.loadMetadata('about');

    this.slides = document.querySelectorAll('.slide');
    this.controls = document.querySelectorAll('.slider__control');
    this.numOfSlides = this.slides.length;

    Array.from(this.slides).forEach(($el: Element, index: number) => {
      const i = index + 1;
      $el.classList.add('slide-' + i);
      $el.setAttribute('data-slide', String(i));
    });

    Array.from(this.controls).forEach(($el: Element) => {
      $el.addEventListener('click', this.controlClickHandler.bind(this));
    });
  }

  controlClickHandler(event: Event) {
    if (this.slidingBlocked) return;
    this.slidingBlocked = true;

    const $control = event.currentTarget as Element;
    const isRight = $control.classList.contains('m--right');
    const $curActive = document.querySelector('.slide.s--active') as Element;
    let index = +$curActive.getAttribute('data-slide')!;
    isRight ? index++ : index--;

    if (index < 1) index = this.numOfSlides;
    if (index > this.numOfSlides) index = 1;

    const $newActive = document.querySelector('.slide-' + index) as Element;

    $control.classList.add('a--rotation');
    $curActive.classList.remove('s--active', 's--active-prev');
    document.querySelector('.slide.s--prev')?.classList.remove('s--prev');

    $newActive.classList.add('s--active');
    if (!isRight) $newActive.classList.add('s--active-prev');

    let prevIndex = index - 1;
    if (prevIndex < 1) prevIndex = this.numOfSlides;

    document.querySelector('.slide-' + prevIndex)?.classList.add('s--prev');

    setTimeout(() => {
      $control.classList.remove('a--rotation');
      this.slidingBlocked = false;
    }, this.slidingAT * 0.75);
  }
}
