import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ApiService, Conn, ConnsResponse } from '../../service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns = ['index', 'status', 'key', 'send', 'recv', 'seen'];
  dataSource: ExampleDataSource = null;
  dataSize = 0;
  refreshTask = null;
  constructor(private api: ApiService, private snackBar: MdSnackBar, private router: Router) { }
  ngOnInit() {
    this.refresh();
    this.refreshTask = setInterval(() => {
      this.refresh();
    }, 10000);
  }
  ngOnDestroy() {
    this.close();
  }
  TrackByKey(index, item) {
    return item ? item.index : undefined;
  }
  status(ago: number) {
    const now = new Date().getTime() / 1000;
    return (now - ago) < 180;
  }
  refresh(ev?: Event) {
    if (ev) {
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
    }
    this.dataSource = new ExampleDataSource(this.api);
    if (ev) {
      this.snackBar.open('Refresh Successful', 'Dismiss', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }
  openStatus(ev: Event, conn: Conn) {
    if (!conn) {
      this.snackBar.open('Unable to obtain the node state', 'Dismiss', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }
    this.router.navigate(['node'], { queryParams: { key: conn.key } });
  }
  close() {
    clearInterval(this.refreshTask);
  }
}
export class ExampleDataSource extends DataSource<any> {
  size = 0;
  constructor(private api: ApiService) {
    super();
  }
  connect(): Observable<Conn[]> {
    return this.api.getAllNode();
  }

  disconnect() { }
}