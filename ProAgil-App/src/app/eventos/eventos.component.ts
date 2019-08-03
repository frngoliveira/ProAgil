import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale} from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {

  titulo = 'Eventos';

  dataEvento: string;

  eventosFiltrados: Evento[];
  eventos: Evento[] ;
  evento: Evento;
  modoSalvar = 'post';

  imagemAltura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;
  fileNameToUpdate: any;
  dataAtual: string;

  // tslint:disable-next-line:variable-name
  _filtroLista: string;


  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

    get filtroLista(): string {
      return this._filtroLista;
    }

    set filtroLista(Value: string) {
      this._filtroLista = Value;
      this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }

    editarEvento(evento: Evento, template: any) {
      this.modoSalvar = 'put';
      this.openModal(template);
      this.evento = Object.assign({}, evento);
      this.fileNameToUpdate = evento.imagemURL.toString();
      this.evento.imagemURL = '';
      this.registerForm.patchValue(this.evento);
    }

    novoEvento(template: any) {
      this.modoSalvar = 'post';
      this.openModal(template);
    }

    excluirEvento(evento: Evento, template: any) {
      this.openModal(template);
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
    }

    confirmeDelete(template: any) {
      this.eventoService.deleteEvento(this.evento.id).subscribe(
        () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Deleteado com Sucesso');
          }, error => {
            this.toastr.error('Erro ao tentar Deletar');
            console.log(error);
          }
      );
    }

    openModal(template: any) {
      this.registerForm.reset();
      template.show(template);
    }

    ngOnInit() {
      this.validation();
      this.getEventos();
    }

    filtrarEventos(filtrarPor: string): Evento[] {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.eventos.filter(
        evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
        );
      }

      alternarImagem() {
        this.mostrarImagem = !this.mostrarImagem;
      }

      validation() {
        this.registerForm = this.fb.group({
          // tslint:disable-next-line:new-parens
          tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
          // tslint:disable-next-line:new-parens
          local: ['', Validators.required],
          // tslint:disable-next-line:new-parens
          dataEvento: ['', Validators.required],
          // tslint:disable-next-line:new-parens
          imagemURL: ['', Validators.required],
          // tslint:disable-next-line:new-parens
          qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
          // tslint:disable-next-line:new-parens
          telefone: ['', Validators.required],
          // tslint:disable-next-line:new-parens
          email: ['', [Validators.required, Validators.email]]
        });
      }

      onFileChange(event) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          this.file = event.target.files;
          console.log(this.file);
        }
      }

      uploadImagem() {
        if (this.modoSalvar === 'post') {
          const nomeArquivo = this.evento.imagemURL.split('\\', 3);
          this.evento.imagemURL = nomeArquivo[2];

          this.eventoService.postUpload(this.file, nomeArquivo[2])
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.getEventos();
            }
          );
        } else {
          this.evento.imagemURL = this.fileNameToUpdate;
          this.eventoService.postUpload(this.file, this.fileNameToUpdate)
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.getEventos();
            }
          );
        }
      }


      salvarAlteracao(template: any) {
        if (this.registerForm.valid) {
          if (this.modoSalvar === 'post') {
            this.evento = Object.assign({}, this.registerForm.value);

            this.uploadImagem();

            this.eventoService.postEvento(this.evento).subscribe(
              (novoEvento: Evento) => {
                template.hide();
                this.getEventos();
                this.toastr.success('Inserido com Sucesso');
              }, error => {
                this.toastr.error('Erro ao Inserir: ${error}');
              });
            } else {
              this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

              this.uploadImagem();

              this.eventoService.putEvento(this.evento).subscribe(
                () => {
                  template.hide();
                  this.getEventos();
                  this.toastr.success('Editado com Sucesso');
                }, error => {
                  this.toastr.error('Erro ao Atualizar: ${error}');
                });
              }
            }
          }

          getEventos() {
            this.eventoService.getAllEvento()
            .subscribe(
              // tslint:disable-next-line:variable-name
              (_eventos: Evento[]) => {

                this.eventos = _eventos;
                this.eventosFiltrados = this.eventos;
              }, error => {
                this.toastr.error('Erro ao tentar carregar Eventos: ${error}');
              });
            }
          }

