import {Component, OnInit} from '@angular/core';
import {ImageUploadService} from "../../shared/components/inputs/image-upload/image-upload.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-constructor-report',
  standalone: true,
  imports: [],
  templateUrl: './constructor-report.component.html',
  styleUrl: './constructor-report.component.scss'
})
export class ConstructorReportComponent implements OnInit {

  id!: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
  }

}
