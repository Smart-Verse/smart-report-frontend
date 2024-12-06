import {AfterContentInit, Component, ContentChildren, QueryList} from '@angular/core';
import {TabComponent} from "./tab/tab.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    const activeTab = this.tabs.find(tab => tab.active);
    if (!activeTab && this.tabs.first) {
      this.tabs.first.active = true;
    }
  }

  selectTab(index: number) {
    this.tabs.toArray().forEach((tab, i) => tab.active = i === index);
  }
}
