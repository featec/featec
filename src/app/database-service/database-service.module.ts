import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseServiceRoutingModule } from './database-service-routing.module';
import { MysqlComponent } from './mysql/mysql.component';
import { MongodbComponent } from './mongodb/mongodb.component';
import { PostgresqlComponent } from './postgresql/postgresql.component';
import { MariadbComponent } from './mariadb/mariadb.component';
import { ProxysqlComponent } from './proxysql/proxysql.component';
import { MaxscaleComponent } from './maxscale/maxscale.component';
import { CloudComponent } from './cloud/cloud.component';
import { AwsComponent } from './aws/aws.component';


@NgModule({
  declarations: [MysqlComponent, MongodbComponent, PostgresqlComponent, MariadbComponent, ProxysqlComponent, MaxscaleComponent, CloudComponent, AwsComponent],
  imports: [
    CommonModule,
    DatabaseServiceRoutingModule
  ]
})
export class DatabaseServiceModule { }
