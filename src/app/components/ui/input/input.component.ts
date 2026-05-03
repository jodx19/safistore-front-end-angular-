import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() error = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() id = '';
  @Input() name = '';
  @Input() autocomplete = '';
  @Input() icon = '';

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get classes(): string {
    const baseClasses = 'w-full px-4 py-3 bg-bg-secondary/50 border border-border rounded-xl text-text-primary placeholder-text-secondary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple focus:bg-bg-secondary/80';
    
    const errorClasses = this.error 
      ? 'border-error focus:ring-error/20 focus:border-error' 
      : '';
    
    const disabledClasses = this.disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'cursor-text';

    return [baseClasses, errorClasses, disabledClasses].join(' ');
  }

  get inputId(): string {
    return this.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
  }
}
