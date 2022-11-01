import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutoCompleterService } from '../../services/auto-completer.service';

@Component({
  selector: 'app-auto-completer-page',
  templateUrl: './auto-completer.component.html',
  styleUrls: ['./styles/auto-completer.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutoCompleterPageComponent {
  options = {
    simple: [],
    images: []
  };

  constructor(private autoCompleterService: AutoCompleterService) {}

  filter(event, type): void {
    const input = event.target.value;
    if (input === '') {
      this.options[type] = [];
    } else {
      this.autoCompleterService.getData(input).then((res: any) => {
        this.options[type] = res;
      });
    }
  }
}
