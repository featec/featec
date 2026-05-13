import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MysqlComponent } from './mysql/mysql.component';
import { DatabaseServiceComponent } from './database-service.component';
import { MongodbComponent } from './mongodb/mongodb.component';
import { PostgresqlComponent } from './postgresql/postgresql.component';
import { MariadbComponent } from './mariadb/mariadb.component';
import { ProxysqlComponent } from './proxysql/proxysql.component';
import { MaxscaleComponent } from './maxscale/maxscale.component';
import { CloudComponent } from './cloud/cloud.component';
import { AwsComponent } from './aws/aws.component';


const routes: Routes = [

  {
    path: "",
    component: DatabaseServiceComponent ,
  },
  {
    path: 'mysql',
    component: MysqlComponent,
  },

  {
    path: 'mongodb',
    component: MongodbComponent,
  },

  {
    path: 'postgresql',
    component: PostgresqlComponent,
  },

  {
    path: 'mariadb',
    component: MariadbComponent,
  },

  {
    path: 'proxysql',
    component: ProxysqlComponent,
  },

  {
    path: 'maxscale',
    component: MaxscaleComponent,
  },

  {
    path: 'cloud cost optimization',
    component: CloudComponent,
  },

  {
    path: 'aws partners',
    component: AwsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatabaseServiceRoutingModule { }
