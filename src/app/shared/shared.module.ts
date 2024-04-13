import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateSelectTemplateComponent } from './components/date-select-template/date-select-template.component';
import { InputTemplateComponent } from './components/input-template/input-template.component';
import { LanguageSelectComponent } from './components/language-select/language-select.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SelectTemplateComponent } from './components/select-template/select-template.component';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { MatchPasswordDirective } from './directives/matchPassword.directive';
import { PasswordPatternDirective } from './directives/passwordPattern.directive';

@NgModule({
  declarations: [
    HoverClassDirective,
    MatchPasswordDirective,
    PasswordPatternDirective,
    PaginatorComponent,
    LanguageSelectComponent,
    InputTemplateComponent,
    SelectTemplateComponent,
    ValidationErrorsComponent,
    DateSelectTemplateComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    HoverClassDirective,
    MatchPasswordDirective,
    PasswordPatternDirective,
    PaginatorComponent,
    LanguageSelectComponent,
    InputTemplateComponent,
    SelectTemplateComponent,
    ValidationErrorsComponent,
    DateSelectTemplateComponent,
  ],
  providers: [
    DatePipe
  ],
})
export class SharedModule { }
