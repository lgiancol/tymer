import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Lexer, Parser } from 'marked';

@Component({
    selector: 'tymer-markdown-preview',
    templateUrl: './markdown-preview.component.html',
    styleUrls: ['./markdown-preview.component.scss']
})
export class MarkdownPreviewComponent implements OnChanges {
    @Input() text: string | undefined;

    private parser = new Parser();
    private lexer = new Lexer();
    markdown: string | undefined;

    ngOnChanges(changes: SimpleChanges): void {
        this.markdown = this.parser.parse(new Lexer().lex(this.text!));
    }

}
