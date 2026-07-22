import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  Inject,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {css} from '@codemirror/lang-css';
import {html} from '@codemirror/lang-html';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {Compartment, Extension} from '@codemirror/state';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers
} from '@codemirror/view';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  indentOnInput,
  syntaxHighlighting
} from '@codemirror/language';
import {closeBrackets, closeBracketsKeymap, completionKeymap} from '@codemirror/autocomplete';
import {defaultKeymap, history, historyKeymap, indentWithTab} from '@codemirror/commands';
import {searchKeymap} from '@codemirror/search';

export type CodeEditorLanguage = 'json' | 'html' | 'css' | 'javascript';

@Component({
  selector: 'app-code-editor',
  template: '<div #editorHost class="editor-host"></div>',
  styleUrl: './code-editor.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CodeEditorComponent),
    multi: true
  }]
})
export class CodeEditorComponent implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}
  @ViewChild('editorHost', {static: true}) private editorHost!: ElementRef<HTMLDivElement>;

  @Input() language: CodeEditorLanguage = 'html';
  @Input() ariaLabel = 'Editor de código';

  private editor?: EditorView;
  private value = '';
  private disabled = false;
  private isWritingValue = false;
  private readonly languageCompartment = new Compartment();
  private readonly editableCompartment = new Compartment();
  private readonly themeCompartment = new Compartment();
  private themeObserver?: MutationObserver;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngAfterViewInit(): void {
    this.editor = new EditorView({
      parent: this.editorHost.nativeElement,
      doc: this.value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        foldGutter(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
        keymap.of([
          indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...completionKeymap
        ]),
        this.languageCompartment.of(this.languageExtension()),
        this.editableCompartment.of(EditorView.editable.of(!this.disabled)),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          'aria-label': this.ariaLabel,
          spellcheck: 'false'
        }),
        EditorView.updateListener.of(update => {
          if (update.docChanged && !this.isWritingValue) {
            this.value = update.state.doc.toString();
            this.onChange(this.value);
          }
          if (update.focusChanged && !update.view.hasFocus) {
            this.onTouched();
          }
        }),
        this.themeCompartment.of(this.editorTheme())
      ]
    });
    this.themeObserver = new MutationObserver(() => {
      this.editor?.dispatch({effects: this.themeCompartment.reconfigure(this.editorTheme())});
    });
    this.themeObserver.observe(this.document.documentElement, {attributes: true, attributeFilter: ['class']});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor) return;

    if (changes['language']) {
      this.editor.dispatch({
        effects: this.languageCompartment.reconfigure(this.languageExtension())
      });
    }
  }

  writeValue(value: string | null | undefined): void {
    const nextValue = value ?? '';
    this.value = nextValue;

    if (!this.editor || this.editor.state.doc.toString() === nextValue) return;

    this.isWritingValue = true;
    try {
      this.editor.dispatch({
        changes: {from: 0, to: this.editor.state.doc.length, insert: nextValue}
      });
    } finally {
      this.isWritingValue = false;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    if (this.editor) {
      this.editor.dispatch({
        effects: this.editableCompartment.reconfigure(EditorView.editable.of(!disabled))
      });
    }
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.editor?.destroy();
  }

  private languageExtension(): Extension {
    switch (this.language) {
      case 'json': return json();
      case 'css': return css();
      case 'javascript': return javascript();
      default: return html({matchClosingTags: true, autoCloseTags: true});
    }
  }

  private editorTheme(): Extension {
    return EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: 'var(--editor-bg)',
      color: 'var(--editor-text)',
      fontSize: '14px'
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      lineHeight: '1.6'
    },
    '.cm-content': {caretColor: '#22d3ee', padding: '14px 0'},
    '.cm-cursor, .cm-dropCursor': {borderLeftColor: '#22d3ee'},
    '.cm-gutters': {
      backgroundColor: 'var(--editor-gutter)',
      color: 'var(--editor-muted)',
      borderRight: '1px solid var(--editor-border)'
    },
    '.cm-activeLine, .cm-activeLineGutter': {backgroundColor: 'var(--editor-line)'},
    '&.cm-focused .cm-selectionBackground, ::selection': {backgroundColor: 'var(--editor-selection) !important'},
    '.cm-foldPlaceholder': {backgroundColor: 'var(--editor-line)', border: 'none', color: 'var(--editor-muted)'}
    }, {dark: this.document.documentElement.classList.contains('app-dark')});
  }
}
