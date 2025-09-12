import { Component } from '@angular/core';

@Component({
  selector: 'not-found',
  imports: [],
  template: `
    <h1>404 - Not Found</h1>
  `,
  styles: [`
    h1 { color: red; }
    `],
})
export class NotFound {
}
