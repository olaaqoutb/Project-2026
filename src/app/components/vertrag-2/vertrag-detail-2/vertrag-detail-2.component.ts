// import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import {MatDialog,MatDialogModule,MatDialogRef,MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
// import { VertrageService } from '../../../services/vertrage.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { DeleteConfirmDialogComponent } from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import {
  StundensatzAendeungDialogComponent,
  StundensatzAendeungDialogResult,
} from '../../dialogs/Stundensatz-aendeung-dialog/stundensatz-aendeung-dialog/stundensatz-aendeung-dialog.component';
import { StundensatzAenderungListComponent } from '../stundensatz-aenderung-list/stundensatz-aenderung-list.component';
import { StundensatzAenderungEntry } from '../../dialogs/stundensatz-aenderung-create-dialog/stundensatz-aenderung-create-dialog.component';
import { FlatNode } from '../../../models/Flat-node';
import { TaetigkeitNode } from '../../../models/TaetigkeitNode';
import { VertragService } from '../../../services/vertrag.service';
import { ApiVertrag } from '../../../models/ApiVertrag';
import { ApiVertragPosition } from '../../../models/ApiVertragPosition';
import{ApiVertragPositionVerbraucher}from "../../../models/ApiVertragPositionVerbraucher";
import{ApiStundenplanung} from "../../../models/ApiStundenplanung";
import { ApiPerson } from '../../../models/ApiPerson';
import { ApiProdukt } from '../../../models/ApiProdukt';
import { ApiProduktPosition } from '../../../models/ApiProduktPosition';
import{ApiVertragBezugsart}from"../../../models/ApiVertragBezugsart"
import{ApiVertragsTyp}from"../../../models/ApiVertragsTyp"
import { ApiVerbraucherTyp } from '../../../models/ApiVerbraucherTyp';
import { VertragTreeNode } from '../../../models/VertragTreeNode';
import { HttpError } from '../../../models/HttpError';
import { VERTRAG_DETAIL_MESSAGES } from '../../../constants/vertrag-detail-messages';
import { StatusPanelService } from '../../../services/utils/status-panel-status.service';
import { AppConstants } from '../../../models/app-constants';

// import{VertraegeService}from "../../../services/vertrage.service"

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'dd.MM.yyyy') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return super.format(date, displayFormat);
  }
}

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-vertrage-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatToolbarModule,
    StundensatzAenderungListComponent,

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './vertrag-detail-2.component.html',
  styleUrl: './vertrag-detail-2.component.scss'
})
export class VertragDetail2Component  implements OnInit {
vertragForm!: FormGroup;
  positionDetailForm!: FormGroup;
  verbraucherDetailForm!: FormGroup;
  childDetailForm!: FormGroup;
  // Inline Stundensatz-Änderung rows shown next to the date/satz buttons in
  // the Verbraucher form. Replaces the old free-text textarea.
  stundensatzAenderungen: StundensatzAenderungEntry[] = [];
  isFormEditable = false;
  isPositionFormEditable = false;
  isVerbraucherFormEditable = false;
  isChildFormEditable = false;
  saving = false;
  loading = true;
  originalVertragData: Record<string, unknown> = {};
  vertragspositionen: VertragTreeNode[] = [];
  selectedPosition: VertragTreeNode | null = null;
  private destroyRef = inject(DestroyRef);
verantwortlicherOptions: { id: string; fullName: string }[] = [];
  servicemanagerOptions: string[] = [];
    vertragList: { id: string; produktname: string }[] = [];
  vertragPositionTypenList: { id: string; produktPositionname: string }[] = [];
  readonly messages = VERTRAG_DETAIL_MESSAGES;

isNewPositionBeingCreated = false;
isNewVerbraucherBeingCreated = false;
isNewChildBeingCreated = false;
positionSubmitAttempted = false;
childSubmitAttempted = false;
verbraucherSubmitAttempted = false;
vertragSubmitAttempted = false;
 editingNewNodeParentId: string | null = null;
 vertragId!: string;
rollenbezeichnungOptions: string[] = [];
geschaeftszahlenOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private vertrageService: VertragService,
    private cdr: ChangeDetectorRef,
    private statusPanelService: StatusPanelService,

  ) {
    this.bezugsartenOptions = this.buildOption(ApiVertragBezugsart);
    this.vertragsTypOptions = this.buildOption(ApiVertragsTyp);
  }

ngOnInit(): void {
  this.vertragId = this.route.snapshot.paramMap.get('id')!;

  this.initMainForm();
  this.initPositionDetailForm();
  this.initVerbraucherDetailForm();
  this.initChildDetailForm();
  this.loadRollenbezeichnungen();
  this.loadVerantwortlicherOptions();
  this.loadProdukte();
  this.loadGeschaeftszahlen();

  if (!this.vertragId || this.vertragId === 'new') {
    this.vertragId = null!;
    this.isFormEditable = true;
    this.vertragForm.enable();
    this.vertragForm.patchValue({
      aktiv: true,
      ende: new Date(9999, 11, 31),
    });
    this.loading = false;
    return;
  }

  this.loadVertragData();
}
private loadVerantwortlicherOptions(): void {
  this.vertrageService.getPersonen1()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        const persons = response.body ?? [];
        this.verantwortlicherOptions = persons.map(p => ({
          id: p.id ?? '',
          fullName: `${p.vorname || ''} ${p.nachname || ''}`.trim()
        }));
      },
      error: (error: HttpError) => console.error('Error loading Verantwortlicher:', error)
    });
}
private loadGeschaeftszahlen(): void {
  this.vertrageService.getAlleAktuellenGeschaeftszahlen()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        const data = response.body ?? {};
        const raw = Array.isArray(data.geschaeftszahl) ? data.geschaeftszahl : [];
        this.geschaeftszahlenOptions = ['', ...raw];
      },
      error: (error: HttpError) => console.error('Error loading Geschaeftszahlen:', error)
    });
}
private loadProdukte(): void {
  this.vertrageService.getProdukte()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        const produkte = response.body ?? [];
        this.vertragList = produkte.map((p) => ({
          id: p.id || p.produktname || '',
          produktname: p.produktname || ''
        }));
      },
      error: (error: HttpError) => console.error('Error loading Produkte:', error)
    });
}

private loadProduktPositionen(produktId: string, onLoaded?: () => void): void {
  if (!produktId) {
    this.vertragPositionTypenList = [];
    onLoaded?.();
    return;
  }
  this.vertrageService.getProdukt(produktId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        const produkt = response.body;
        this.vertragPositionTypenList = (produkt?.produktPosition || []).map((pp: ApiProduktPosition) => ({
          id: pp.id || pp.produktPositionname || '',
          produktPositionname: pp.produktPositionname || ''
        }));
        onLoaded?.();
      },
      error: (error: HttpError) => {
        console.error('Error loading ProduktPositionen:', error);
        onLoaded?.();
      }
    });
}

private loadRollenbezeichnungen(): void {
  this.vertrageService.getAlleAktuellenRollenbezeichnungen()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        const data = response.body ?? {};
        this.rollenbezeichnungOptions = Array.isArray(data.rollenbezeichnung) ? data.rollenbezeichnung : [];
      },
      error: (error: HttpError) => {
        console.error('Error loading Rollenbezeichnungen:', error);
      }
    });
}
 addVertragsposition(): void {
  if (this.isTopVertragFormBusy) return; // top Vertrag form is being edited/created
  this.cancelAndResetNewFlags();

  const newPosition: VertragTreeNode = {
    id: `new-level1-${Date.now()}`,
    name: 'Neue Vertragsposition',
    start: undefined,
    ende: undefined,
    status: 'active',
    aktiv: true,
    typ: 'Vertragsposition',
    isExpanded: false,
    level: 1,
    auftraggeber: '',
    organisationseinheit: '',
    durchfuehrungsverantwortlicher: '',
    positionstyp: '',
    buchungsfreigabe: false,
    anmerkung: '',
    volumenEuro: 0,
    volumenStunden: 0,
    stundenGeplant: 0,
    children: [],
    isNew: true,
    isPendingCreation: true
  };
  this.selectedPosition = newPosition;
  this.isPositionFormEditable = true;
  this.positionDetailForm.enable();
  this.positionDetailForm.reset({
    aktiv: true,
    positionsbezeichnung: '',
    planungsjahr: '',
    volumen: '',
    volumenEuro: '',
    jahresuebertrag: false,
    rollenbezRahmenvertrag: '',
    anmerkung: '',
  });

  this.positionSubmitAttempted = false;
  this.isNewPositionBeingCreated = true;
  this.editingNewNodeParentId = null;
}

addVerbraucher(parentNode: VertragTreeNode, event: Event): void {
  event.stopPropagation();
  if (this.isTopVertragFormBusy) return; // top Vertrag form is being edited/created
  this.cancelAndResetNewFlags();

  if (!parentNode || parentNode.level !== 1) return;

  const newVerbraucher: VertragTreeNode = {
    id: `new-level2-${Date.now()}`,
    name: 'Neue Person',
    typ: 'Verbraucher',
    level: 2,
    parentId: parentNode.id,
    volumenEuro: 0,
    volumenStunden: 0,
    stundenGeplant: 0,
    aktiv: true,
    children: [],
    isNew: true,
    isPendingCreation: true
  };
  this.selectedPosition = newVerbraucher;
  this.isVerbraucherFormEditable = true;
  this.verbraucherDetailForm.enable();
  this.verbraucherDetailForm.reset({
    aktiv: true,
    verbraucherTyp: '',
    person: '',
    verbraucher: '',
    stundensatz: '',
    StundensatzAnderung: '',
    stundenkontingent: '',
    volumenEuro: '',
    anmerkung: '',
  });
  this.verbraucherSubmitAttempted = false;
  this.isNewVerbraucherBeingCreated = true;
  this.editingNewNodeParentId = parentNode.id;
}

 canAddVerbraucher(node:FlatNode): boolean {
  return node && node.level === 1;
}

canAddStundenplanung(node: FlatNode): boolean {
  return node && node.level === 2;
}

// True while the top Vertrag form is in create OR edit mode. Used to
// block any tree creation / selection / expansion (the user is busy
// finishing the top form first).
get isTopVertragFormBusy(): boolean {
  return this.isFormEditable === true;
}
     addStundenplanung(parentNode: VertragTreeNode, event: Event): void {
  event.stopPropagation();
  if (this.isTopVertragFormBusy) return; // top Vertrag form is being edited/created
  this.cancelAndResetNewFlags();

  if (!parentNode || parentNode.level !== 2) return;

  const newStundenplanung: VertragTreeNode = {
    id: `new-level3-${Date.now()}`,
    name: 'Neue Stundenplanung',
    typ: 'Stundenplanung',
    level: 3,
    parentId: parentNode.id,
    aktiv: true,
    stundenGeplant: 0,
    anmerkung: '',
    produkt: '',
    produktposition: '',
    produktPosition: {},
    isNew: true,
    isPendingCreation: true
  };
  this.selectedPosition = newStundenplanung;
  this.isChildFormEditable = true;
  this.childDetailForm.enable();
  this.childDetailForm.reset({
    produkt: '',
    produktposition: '',
    stundenGeplant: '',
    anmerkung: '',
    aktiv: true,
  });
  this.childSubmitAttempted = false;
  this.isNewChildBeingCreated = true;
  this.editingNewNodeParentId = parentNode.id;
}

  private initMainForm(): void {
    this.vertragForm = this.fb.group({
      vertragsname: ['', Validators.required],
      vertragszusatz: ['', Validators.required],
      vertragspartner: ['', Validators.required],
      auftraggeber: ['', Validators.required],
      vertragsverantwortlicher: [''],
      bezugsart: [''],
      elak: [''],
      beschaffungsnummer: [''],
      lkVertrag: [false],
      aktiv: [false],
      erstellungsdatum: [null, Validators.required],
      start: [null, Validators.required],
      ende: [null, Validators.required],
      vertragssumme: ['', Validators.required],
      auftragsreferenz: [''],
      rahmenvertragGZ: [''],
      vertragstype: ['', Validators.required],
      anmerkung: ['']
    });
  }
bezugsartenOptions: string[] = [];
vertragsTypOptions: string[] = [];
verbraucherArray: string[] = ['Personal', 'Sachmittel'];

private buildOption(enumObj: Record<string, string>): string[] {
  return Object.values(enumObj);
}


  private initPositionDetailForm(): void {
    this.positionDetailForm = this.fb.group({
      aktiv: [false],
      positionsbezeichnung: ['', Validators.required],
      planungsjahr: ['', Validators.required],
      volumen: [''],
      volumenEuro: ['', Validators.required],
      jahresuebertrag: [false],
      rollenbezRahmenvertrag: [''],
      anmerkung: [''],
    });
    this.positionDetailForm.disable();
  }

  private initVerbraucherDetailForm(): void {
    this.verbraucherDetailForm = this.fb.group({
      aktiv: [false],
      verbraucherTyp: ['', Validators.required],
      person: [''],
      verbraucher: [''],
      stundensatz: [''],
      StundensatzAnderung:[''],
      stundenkontingent: [''],
      volumenEuro: [''],            // no longer required — only Verbrauchertyp is required by default
      anmerkung: ['']
    });
    this.verbraucherDetailForm.disable();

    // Required fields depend on the selected Verbrauchertyp
    this.verbraucherDetailForm.get('verbraucherTyp')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((typ: string) => {
        this.applyVerbraucherRequiredValidators(typ);
        // Picking a Verbrauchertyp must always reveal its dependent fields
        // in their normal (non-red) state — even if the user previously
        // clicked save with an empty form. They have to click Save again
        // to see the new fields highlighted.
        this.verbraucherSubmitAttempted = false;
      });
  }

  private applyVerbraucherRequiredValidators(typ: string): void {
    // Intentionally a no-op now. We don't add Validators.required dynamically
    // anymore, otherwise Material auto-paints the fields red as soon as the
    // user picks a Verbrauchertyp (before any save attempt). Required-ness
    // by typ is enforced manually in saveVerbraucherDetails via
    // isVerbraucherRequiredMissing(...).
    void typ;
    const personCtl = this.verbraucherDetailForm.get('person');
    const stundensatzCtl = this.verbraucherDetailForm.get('stundensatz');
    const stundenkontingentCtl = this.verbraucherDetailForm.get('stundenkontingent');
    const verbraucherCtl = this.verbraucherDetailForm.get('verbraucher');
    personCtl?.clearValidators();
    stundensatzCtl?.clearValidators();
    stundenkontingentCtl?.clearValidators();
    verbraucherCtl?.clearValidators();
    personCtl?.updateValueAndValidity({ emitEvent: false });
    stundensatzCtl?.updateValueAndValidity({ emitEvent: false });
    stundenkontingentCtl?.updateValueAndValidity({ emitEvent: false });
    verbraucherCtl?.updateValueAndValidity({ emitEvent: false });
  }

  // Checks whether a Verbraucher field is required-by-typ AND empty.
  // Used in the template (gated by verbraucherSubmitAttempted) so the red
  // highlight only appears AFTER the user clicks Save and the field is
  // actually missing — Material itself never marks the field invalid.
  isVerbraucherRequiredMissing(field: string): boolean {
    const value = this.verbraucherDetailForm.get(field)?.value;
    const empty = value === null || value === undefined || value === '';
    if (field === 'verbraucherTyp') return empty;

    const typ = this.verbraucherDetailForm.get('verbraucherTyp')?.value;
    if (typ === 'Personal') {
      return ['person', 'stundensatz', 'stundenkontingent'].includes(field) && empty;
    }
    if (typ === 'Sachmittel') {
      return field === 'verbraucher' && empty;
    }
    return false;
  }

private initChildDetailForm(): void {
  this.childDetailForm = this.fb.group({
    produkt: [''],
    produktposition: ['', Validators.required],
    stundenGeplant: ['', Validators.required],
    anmerkung: [''],
    aktiv: [false],
  });

  this.childDetailForm.get('produkt')!.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((produktId: string) => {
      this.loadProduktPositionen(produktId);
    });
}

 private loadVertragData(): void {
  this.loading = true;

  this.vertrageService.getVertrag(this.vertragId, true)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
    next: (response) => {
      const detailData = response.body;
      if (!detailData) {
        this.loading = false;
        return;
      }

      if (detailData.vertragsverantwortlicher) {
        const v = detailData.vertragsverantwortlicher;
        const exists = this.verantwortlicherOptions.some(p => p.id === v.id);
        if (!exists) {
          this.verantwortlicherOptions = [
            ...this.verantwortlicherOptions,
            { id: v.id ?? '', fullName: `${v.vorname || ''} ${v.nachname || ''}`.trim() }
          ];
        }
      }

      const bezugsartValue = this.encodeFromApi(ApiVertragBezugsart, detailData.bezugsart);
      const vertragsTypValue = this.encodeFromApi(ApiVertragsTyp, detailData.vertragsTyp)
      if (bezugsartValue && !this.bezugsartenOptions.includes(bezugsartValue)) {
        this.bezugsartenOptions = [...this.bezugsartenOptions, bezugsartValue];
      }
      if (vertragsTypValue && !this.vertragsTypOptions.includes(vertragsTypValue)) {
        this.vertragsTypOptions = [...this.vertragsTypOptions, vertragsTypValue];
      }
      this.loading = false;
      this.cdr.detectChanges();
      this.vertragForm.patchValue({
        vertragsname:    detailData.vertragsname    || '',
        vertragszusatz:  detailData.vertragszusatz  || '',
        vertragspartner: detailData.vertragspartner || '',
        auftraggeber:    detailData.auftraggeber    || '',
        vertragsverantwortlicher: detailData.vertragsverantwortlicher?.id ?? '',
        bezugsart: bezugsartValue || '',
        elak: detailData.elak|| '',
        beschaffungsnummer: detailData.beschaffungsnummer || '',
        lkVertrag: detailData.lkKennung || false,
        aktiv:  detailData.aktiv || false,
        erstellungsdatum: detailData.erstelldatum ? new Date(detailData.erstelldatum) : null,
        start:detailData.gueltigVon   ? new Date(detailData.gueltigVon)   : null,
        ende:detailData.gueltigBis   ? new Date(detailData.gueltigBis)   : null,
        vertragssumme:detailData.vertragssumme    || '',
        auftragsreferenz: detailData.auftragsreferenz || '',
        rahmenvertragGZ: detailData.geschaeftszahl || '',
        vertragstype: vertragsTypValue || '',
        anmerkung: detailData.anmerkung || ''
      });
      this.originalVertragData = JSON.parse(JSON.stringify(this.vertragForm.getRawValue()));
      if (!this.isFormEditable) {
        this.vertragForm.disable({ emitEvent: false });
      }
      this.cdr.detectChanges();

      if (detailData.vertragPosition) {
        this.vertragspositionen = detailData.vertragPosition.map((parentPos: ApiVertragPosition) => ({
          id:           parentPos.id ?? '',
          name:         parentPos.position || 'Unnamed Position',
          aktiv:        parentPos.aktiv !== false,
          typ:          'Vertragsposition',
          isExpanded:   false,
          level:        1,
          volumenEuro:  parentPos.volumenEuro,
          volumenStunden: parentPos.volumenStunden,
          stundenGeplant: parentPos.stundenGeplant,
          anmerkung:    parentPos.anmerkung || '',
          planungsjahr: parentPos.planungsjahr           || '',
          jahresuebertrag: parentPos.jahresuebertrag        || false,
          rollenbezRahmenvertrag: parentPos.rollenbezeichnungRahmenvertrag || '',

          children: parentPos.vertragPositionVerbraucher?.map((verbraucher: ApiVertragPositionVerbraucher, vIndex: number) => ({
            id:  verbraucher.id || `${parentPos.id}-v${vIndex}`,
            name: verbraucher.person
                            ? `${verbraucher.person.vorname ?? ''} ${verbraucher.person.nachname ?? ''}`.trim() || verbraucher.verbraucher || 'Unbekannter Verbraucher'
                            : verbraucher.verbraucher || verbraucher.verbraucherTyp || 'Unbekannter Verbraucher',
            personId: verbraucher.person?.id,
            typ: 'Verbraucher',
            level:2,
            isExpanded: false,
            parentId:parentPos.id,
            aktiv:verbraucher.aktiv !== false,
            volumenEuro:verbraucher.volumenEuro,
            volumenStunden: verbraucher.volumenStunden,
            stundenGeplant: verbraucher.stundenGeplant,
            verbraucherTyp:  this.encodeFromApi(this.verbraucherTypMap, verbraucher.verbraucherTyp),
            stundensatz: verbraucher.stundenpreis   || '',
            stundenkontingent: verbraucher.stundenGeplant || '',
            anmerkung: verbraucher.anmerkung      || '',
            children: verbraucher.stundenplanung?.map((plan: ApiStundenplanung, pIndex: number) => ({
              id: plan.id || `${verbraucher.id}-p${pIndex}`,
              name:plan.produktPosition?.produkt?.produktname || `Plan ${pIndex + 1}`,
              aktiv:plan.produktPosition?.aktiv !== false,
              typ:'Stundenplanung',
              level: 3,
              parentId:verbraucher.id,
              stundenGeplant: plan.stundenGeplant,
              anmerkung: plan.anmerkung || plan.produktPosition?.anmerkung || '',
              produktPosition: plan.produktPosition
            })) || []
          })) || []
        }));
        this.sortNodesByName(this.vertragspositionen);
      }
    },
    error: (error: HttpError) => {
      console.error('Error:', error);
      this.loading = false;
      this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.vertrag.loadFailed);
      this.router.navigate(['/vertraege-2']);
    }
  });
}

private readonly verbraucherTypMap: Record<string, string> = {
  PERSONAL:   'Personal',
  SACHMITTEL: 'Sachmittel'
};

private encodeFromApi(map: Record<string, string>, value: string | null | undefined): string {
  if (!value) return '';
  return map[value] ?? value;
}

private encodeToApi(map: Record<string, string>, value: string | null | undefined): string {
  if (!value) return '';
  const entry = Object.entries(map).find(([, v]) => v === value);
  return entry ? entry[0] : value;
}
  // Main Form Actions (Vertrag)
onEditOrSubmit(): void {
  if (!this.isFormEditable) {
    // Top form is stronger than any inner form — entering edit mode on the
    // top Vertrag form closes any tree-level form that is currently being
    // edited or newly created.
    this.closeAnyInnerEdit();

    this.isFormEditable = true;
    this.vertragForm.enable();
  } else {
    this.onSubmit();
  }
}

// Close any tree-level form (Vertragsposition / Verbraucher / Stundenplanung)
// that is currently in edit mode or pending creation. Used when the top
// Vertrag form enters edit mode — the top form always wins.
private closeAnyInnerEdit(): void {
  // Discard any new node that is pending in the tree (not yet saved).
  this.cancelAndResetNewFlags();

  if (this.isPositionFormEditable) {
    this.cancelPositionDetails();
  }
  if (this.isVerbraucherFormEditable) {
    this.cancelVerbraucherDetails();
  }
  if (this.isChildFormEditable) {
    this.cancelChildDetails();
  }
  this.isPositionFormEditable = false;
  this.isVerbraucherFormEditable = false;
  this.isChildFormEditable = false;
  this.positionSubmitAttempted = false;
  this.verbraucherSubmitAttempted = false;
  this.childSubmitAttempted = false;
}
onSubmit(): void {
  this.vertragSubmitAttempted = true;
  if (this.vertragForm.invalid) {
    this.vertragForm.markAllAsTouched();
    this.showErrorDialog(
      this.buildRequiredErrorMessage(this.vertragForm, this.vertragLabelMap),
      VERTRAG_DETAIL_MESSAGES.dialogTitles.validationError
    );
    return;
  }

  this.saving = true;
  const formValues = this.vertragForm.getRawValue();
  const isNewVertrag = !this.vertragId;

  const dto = {} as ApiVertrag;
  dto.id = this.vertragId;
  dto.vertragsname = formValues.vertragsname;
  dto.vertragspartner = formValues.vertragspartner;
  dto.auftraggeber = formValues.auftraggeber;
  dto.vertragszusatz = formValues.vertragszusatz;
  dto.auftragsreferenz = formValues.auftragsreferenz;
  dto.elak = formValues.elak;
  dto.beschaffungsnummer = formValues.beschaffungsnummer;
  dto.anmerkung = formValues.anmerkung;
  dto.vertragssumme = formValues.vertragssumme?.toString();
  dto.aktiv = formValues.aktiv;
  dto.lkKennung = formValues.lkVertrag;
  dto.bezugsart = this.encodeToApi(ApiVertragBezugsart, formValues.bezugsart) as ApiVertragBezugsart;
  dto.vertragsTyp = this.encodeToApi(ApiVertragsTyp, formValues.vertragstype) as ApiVertragsTyp;
  dto.geschaeftszahl = formValues.rahmenvertragGZ;
  dto.vertragsverantwortlicher = { id: formValues.vertragsverantwortlicher } as ApiPerson;

  if (formValues.erstellungsdatum) {
    dto.erstelldatum = formValues.erstellungsdatum.toISOString();
  }
  if (formValues.start) {
    dto.gueltigVon = formValues.start.toISOString();
  }
  if (formValues.ende) {
    dto.gueltigBis = formValues.ende.toISOString();
  }

  const saveObservable = isNewVertrag
    ? this.vertrageService.createVertrag(dto)
    : this.vertrageService.updateVertrag(this.vertragId, dto);

  const startTime = Date.now();
  saveObservable
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
    next: (response) => {
      const duration = Date.now() - startTime;
      const saved = response.body;
      this.vertragId = saved?.id ?? this.vertragId;
      this.originalVertragData = JSON.parse(JSON.stringify(this.vertragForm.getRawValue()));
      this.saving = false;
      this.isFormEditable = false;
      this.vertragForm.disable({ emitEvent: false });
      this.vertragSubmitAttempted = false;

      if (isNewVertrag && saved?.id) {
        this.router.navigate(['/vertraege-2', saved.id], { replaceUrl: true });
      }

      this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.vertrag.saveSuccess);
      this.statusPanelService.addMessageRequest(
        isNewVertrag ? AppConstants.MSG_VERTRAG_CREATED_SUCCESS : AppConstants.MSG_VERTRAG_UPDATED_SUCCESS,
        'POST', duration, response);
    },
    error: (error) => {
      const duration = Date.now() - startTime;
      console.error('Error saving Vertrag:', error);
      this.saving = false;
      this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.vertrag.saveFailed);
      this.statusPanelService.addMessageRequest(
        isNewVertrag ? AppConstants.MSG_VERTRAG_CREATED_ERROR : AppConstants.MSG_VERTRAG_UPDATED_ERROR,
        'POST', duration, error);
    }
  });
}

  onCancel(): void {
  if (this.isFormEditable) {
    if (!this.vertragId) {
      this.router.navigate(['/vertraege-2']);
      return;
    }
    this.isFormEditable = false;
    this.vertragSubmitAttempted = false;
    this.vertragForm.patchValue(this.originalVertragData, { emitEvent: false });
    this.vertragForm.disable({ emitEvent: false });
  } else {
    this.router.navigate(['/vertraege-2']);
  }
}
selectPosition(position: VertragTreeNode): void {
  // While the top Vertrag form is being created/edited the user can still
  // browse the tree (select + expand) — they just can't enter edit mode
  // for the inner forms or create new tree nodes.

  if (this.selectedPosition?.id === position.id && !position.isNew) {
    return;
  }

  if (this.isNewPositionBeingCreated || this.isNewVerbraucherBeingCreated || this.isNewChildBeingCreated) {
    if (this.selectedPosition && this.selectedPosition.id === position.id && this.selectedPosition.isNew) {
        return;
    }
      this.discardNewPosition(false);
  this.doSelectPosition(position);

    return;
  }

  this.doSelectPosition(position);
}

toggleExpand(position: VertragTreeNode, event: Event): void {
  event.stopPropagation();
  if (position.isNew) return;

  const willExpand = !position.isExpanded;
  position.isExpanded = willExpand;

  // Single-expansion rule: when opening a node, close every other node at
  // the SAME level (and below) so only one branch is open per level.
  if (willExpand) {
    this.collapseSiblingsAndDeeper(position);
  }
}

// Walk the whole tree; collapse any node that is at the same level as
// `opened` OR deeper, except `opened` itself and its ancestors. Effect:
// opening a level-1 closes all other level-1s (and their children);
// opening a level-2 closes all other level-2s (and their children).
private collapseSiblingsAndDeeper(opened: VertragTreeNode): void {
  const ancestors = new Set<VertragTreeNode>();
  this.collectAncestors(this.vertragspositionen, opened, [], ancestors);

  const walk = (nodes: VertragTreeNode[] | undefined): void => {
    if (!nodes) return;
    for (const n of nodes) {
      if (n !== opened && !ancestors.has(n) && n.level >= opened.level && n.isExpanded) {
        n.isExpanded = false;
      }
      walk(n.children);
    }
  };
  walk(this.vertragspositionen);
}

private collectAncestors(
  nodes: VertragTreeNode[] | undefined,
  target: VertragTreeNode,
  trail: VertragTreeNode[],
  out: Set<VertragTreeNode>
): boolean {
  if (!nodes) return false;
  for (const n of nodes) {
    if (n === target) {
      trail.forEach(a => out.add(a));
      return true;
    }
    if (this.collectAncestors(n.children, target, [...trail, n], out)) return true;
  }
  return false;
}

private doSelectPosition(position: VertragTreeNode): void {
  this.selectedPosition = position;
  this.isPositionFormEditable = false;
  this.isVerbraucherFormEditable = false;
  this.isChildFormEditable = false;
  this.positionSubmitAttempted = false;
  this.childSubmitAttempted = false;
  this.verbraucherSubmitAttempted = false;
  this.editingNewNodeParentId = null;

  if (position.isNew) {
    if (position.typ === 'Vertragsposition') {
      this.isPositionFormEditable = true;
      this.positionDetailForm.enable();
      this.isNewPositionBeingCreated = true;
    } else if (position.typ === 'Verbraucher') {
      this.isVerbraucherFormEditable = true;
      this.verbraucherDetailForm.enable();
      this.isNewVerbraucherBeingCreated = true;
    } else if (position.typ === 'Stundenplanung' || position.typ === 'Dokumentation') {
      this.isChildFormEditable = true;
      this.childDetailForm.enable();
      this.isNewChildBeingCreated = true;
    }
  }

  if (position.typ === 'Vertragsposition') {
   this.positionDetailForm.patchValue({
  aktiv:position.aktiv|| false,
  positionsbezeichnung:position.name|| '',
  planungsjahr:  position.planungsjahr || '',
  volumen:  position.volumenStunden || '',
  volumenEuro: position.volumenEuro || '',
  jahresuebertrag:position.jahresuebertrag|| false,
  rollenbezRahmenvertrag: position.rollenbezRahmenvertrag || '',
  anmerkung: position.anmerkung || '',
});
    if (!this.isPositionFormEditable) this.positionDetailForm.disable();
  } else if (position.typ === 'Verbraucher') {
  this.verbraucherDetailForm.patchValue({
    aktiv:position.aktiv|| false,
    verbraucherTyp:position.verbraucherTyp || '',
    person: position.personId ?? '',
    verbraucher: position.verbraucherTyp === 'Sachmittel' ? (position.name || '') : '',
    stundensatz:position.stundensatz || '',
    stundenkontingent: position.stundenkontingent|| '',
    volumenEuro:position.volumenEuro|| '',
    anmerkung:position.anmerkung|| '',
    StundensatzAnderung: position.stundensatzAenderung || ''
  });
    if (!this.isVerbraucherFormEditable) this.verbraucherDetailForm.disable();
  } else if (position.typ === 'Stundenplanung' || position.typ === 'Dokumentation') {
    const produktObj = position.produktPosition?.produkt;
    const produktId = produktObj?.id || produktObj?.produktname || '';
    const produktpositionId =
      position.produktPosition?.id
      || position.produktPosition?.produktPositionname
      || '';

    if (produktId && !this.vertragList.some(p => p.id === produktId)) {
      this.vertragList = [
        ...this.vertragList,
        { id: produktId, produktname: produktObj?.produktname || produktId }
      ];
    }

    this.loadProduktPositionen(produktId || '', () => {
      if (produktpositionId && !this.vertragPositionTypenList.some(p => p.id === produktpositionId)) {
        this.vertragPositionTypenList = [
          ...this.vertragPositionTypenList,
          {
            id: produktpositionId,
            produktPositionname: position.produktPosition?.produktPositionname || produktpositionId
          }
        ];
      }
      this.cdr.detectChanges();
      this.childDetailForm.patchValue({
        produkt: produktId,
        produktposition: produktpositionId,
        stundenGeplant: position.stundenGeplant ?? '',
        anmerkung: position.anmerkung || '',
        aktiv: position.aktiv ?? false
      }, { emitEvent: false });
      if (!this.isChildFormEditable) this.childDetailForm.disable({ emitEvent: false });
      this.cdr.detectChanges();
    });
  }
}

// private isParentOfSelected(possibleParent: VertragTreeNode, selectedNode: VertragTreeNode): boolean {
//   if (!possibleParent.children || possibleParent.children.length === 0) {
//     return false;
//   }


//   for (const child of possibleParent.children) {
//     if (child.id === selectedNode.id) {
//       return true;
//     }
//   }

//   for (const child of possibleParent.children) {
//     if (child.children && this.isParentOfSelected(child, selectedNode)) {
//       return true;
//     }
//   }

//   return false;
// }
  onEditOrSubmitPositionOrChild(): void {
    if (!this.selectedPosition) return;
    // While the top Vertrag form is being created/edited, the inner forms
    // are view-only — block the Bearbeiten / Speichern button so the user
    // can't enter edit mode on a selected level.
    if (this.isTopVertragFormBusy) return;

    if (this.selectedPosition.typ === 'Vertragsposition') {
      if (!this.isPositionFormEditable) {
        this.isPositionFormEditable = true;
        this.positionDetailForm.enable();
      } else {
        this.savePositionDetails();
      }
    }
    else if (this.selectedPosition.typ === 'Verbraucher') {
      if (!this.isVerbraucherFormEditable) {
        this.isVerbraucherFormEditable = true;
        this.verbraucherDetailForm.enable();
      } else {
        this.saveVerbraucherDetails();
      }
    }
    else {
      if (!this.isChildFormEditable) {
        this.isChildFormEditable = true;
        this.childDetailForm.enable({ emitEvent: false });
      } else {
        this.saveChildDetails();
      }
    }
  }

 onCancelPositionOrChild(): void {
  if (!this.selectedPosition) return;

  if (this.selectedPosition.isNew) {
    const parentIdToReSelect = this.editingNewNodeParentId;
    this.discardNewPosition(true);
    if (parentIdToReSelect) {
      const parentNode = this.findNodeById(this.vertragspositionen, parentIdToReSelect);
      if (parentNode) {
        this.selectPosition(parentNode);
      }
    }
  } else {
    if (this.selectedPosition.typ === 'Vertragsposition') {
      this.cancelPositionDetails();
    } else if (this.selectedPosition.typ === 'Verbraucher') {
      this.cancelVerbraucherDetails();
    } else {
      this.cancelChildDetails();
    }
  }
}

openConfirmDeleteNewDialog(): void {
  if (!this.selectedPosition) return;
  const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
    width: '500px',
    data: {
      title: `Neue ${this.selectedPosition.typ} verwerfen?`,
      message: `Wollen Sie die neu erstellte ${this.selectedPosition.typ} "${this.selectedPosition.name}" wirklich verwerfen? Alle ungespeicherten Änderungen gehen verloren.`,
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.discardNewPosition();
    }
  });
}

private savePositionDetails(): void {
    if (!this.selectedPosition) return;
    this.positionSubmitAttempted = true;
    if (this.positionDetailForm.invalid) {
      this.positionDetailForm.markAllAsTouched();
      this.showErrorDialog(
        this.buildRequiredErrorMessage(this.positionDetailForm, this.positionLabelMap),
        VERTRAG_DETAIL_MESSAGES.dialogTitles.validationError
      );
      return;
    }
    const currentNode = this.selectedPosition;
    const formValues = this.positionDetailForm.getRawValue();

    const dto = {} as ApiVertragPosition;
    dto.position = formValues.positionsbezeichnung;
    dto.volumenStunden = formValues.volumen?.toString();
    dto.volumenEuro = formValues.volumenEuro?.toString();
    dto.anmerkung = formValues.anmerkung;
    dto.aktiv = formValues.aktiv;
    dto.planungsjahr = formValues.planungsjahr;
    dto.jahresuebertrag = formValues.jahresuebertrag;
    dto.rollenbezeichnungRahmenvertrag = formValues.rollenbezRahmenvertrag;
    if (currentNode.isPendingCreation) {
      const startTime = Date.now();
      this.vertrageService.createVertragPosition(dto, this.vertragId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            const duration = Date.now() - startTime;
            const created = response.body;
            const newPosition = {
              ...currentNode,
              ...formValues,
              id: created?.id || currentNode.id,
              name: formValues.positionsbezeichnung,
              isPendingCreation: false,
              isNew: false
            };
            this.vertragspositionen.unshift(newPosition);
            this.sortNodesByName(this.vertragspositionen);
            this.finalizePositionSave();
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_VERTRAGSPOSITION_CREATED_SUCCESS, 'POST', duration, response);
          },
          error: (error) => {
            const duration = Date.now() - startTime;
            console.error('Error creating Position:', error);
            this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.position.createFailed);
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_VERTRAGSPOSITION_CREATED_ERROR, 'POST', duration, error);
          }
        });
    } else {
      dto.id = currentNode.id;

      const startTime = Date.now();
      this.vertrageService.updateVertragPosition(currentNode.id, dto)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            const duration = Date.now() - startTime;
            const updateInArray = (arr: VertragTreeNode[], id: string | number, data: Partial<VertragTreeNode>): boolean => {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === id) {
                  arr[i] = { ...arr[i], ...data };
                  this.selectedPosition = arr[i];
                  return true;
                }
                if (arr[i].children && updateInArray(arr[i].children!, id, data)) return true;
              }
              return false;
            };

            updateInArray(this.vertragspositionen, currentNode.id, {
              ...formValues,
              name: formValues.positionsbezeichnung
            });
            this.finalizePositionSave();
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_VERTRAGSPOSITION_UPDATED_SUCCESS, 'POST', duration, response);
          },
          error: (error) => {
            const duration = Date.now() - startTime;
            console.error('Error saving Position:', error);
            this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.position.saveFailed);
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_VERTRAGSPOSITION_UPDATED_ERROR, 'POST', duration, error);
          }
        });
    }
  }

  private finalizePositionSave(): void {
    this.isPositionFormEditable = false;
    this.positionDetailForm.disable();
    this.isNewPositionBeingCreated = false;
    this.positionSubmitAttempted = false;
    if (this.selectedPosition && this.selectedPosition.isNew) {
      this.selectedPosition.isNew = false;
    }
    this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.position.saveSuccess);
  }

  private cancelPositionDetails(): void {
    if (!this.selectedPosition) return;

    this.positionSubmitAttempted = false;
    this.isPositionFormEditable = false;
    this.positionDetailForm.patchValue({
      aktiv: this.selectedPosition?.aktiv ?? false,
      positionsbezeichnung: this.selectedPosition?.name ?? '',
      planungsjahr: this.selectedPosition?.planungsjahr ?? '',
      volumen: this.selectedPosition?.volumenStunden ?? '',
      volumenEuro: this.selectedPosition?.volumenEuro ?? '',
      jahresuebertrag: this.selectedPosition?.jahresuebertrag ?? false,
      rollenbezRahmenvertrag: this.selectedPosition?.rollenbezRahmenvertrag || '',
      anmerkung: this.selectedPosition?.anmerkung ?? '',
    });
    this.positionDetailForm.disable();
  }

 private saveVerbraucherDetails(): void {
  if (!this.selectedPosition) return;
  this.verbraucherSubmitAttempted = true;

  // Manual required-field check (no Validators.required on the typ-dependent
  // fields anymore, so the form is never auto-marked invalid before save).
  const missingFields = ['verbraucherTyp', 'person', 'stundensatz', 'stundenkontingent', 'verbraucher']
    .filter(f => this.isVerbraucherRequiredMissing(f));

  if (missingFields.length > 0 || this.verbraucherDetailForm.invalid) {
    const labels = missingFields.map(f => this.verbraucherLabelMap[f] || f);
    const detail = labels.length
      ? `Bitte füllen Sie folgende Felder aus:\n• ${labels.join('\n• ')}`
      : this.buildRequiredErrorMessage(this.verbraucherDetailForm, this.verbraucherLabelMap);
    this.showErrorDialog(detail, VERTRAG_DETAIL_MESSAGES.dialogTitles.validationError);
    return;
  }

  const currentNode = this.selectedPosition;
  const formValues = this.verbraucherDetailForm.getRawValue();
  const selectedPerson = this.verantwortlicherOptions.find(p => p.id === formValues.person);
  const displayName = formValues.verbraucherTyp === 'Sachmittel'
    ? (formValues.verbraucher || 'Sachmittel')
    : (selectedPerson?.fullName || formValues.person || '');

  const dto = {} as ApiVertragPositionVerbraucher;
  dto.aktiv = formValues.aktiv;
  dto.verbraucher = displayName;
  dto.stundenpreis = formValues.verbraucherTyp === 'Sachmittel' ? '' : formValues.stundensatz?.toString();
  dto.stundenGeplant = formValues.verbraucherTyp === 'Sachmittel' ? '' : formValues.stundenkontingent?.toString();
  dto.volumenEuro = formValues.volumenEuro?.toString();
  dto.anmerkung = formValues.anmerkung;
  dto.verbraucherTyp = this.encodeToApi(this.verbraucherTypMap, formValues.verbraucherTyp) as ApiVerbraucherTyp;
  if (formValues.verbraucherTyp === 'Personal' && formValues.person) {
    dto.person = { id: formValues.person } as ApiPerson;
  }

  if (currentNode.isPendingCreation && this.editingNewNodeParentId) {
    const startTime = Date.now();
    this.vertrageService
      .createVertragPositionVerbraucher(dto, this.editingNewNodeParentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          const created = response.body;
          const parentNode = this.findNodeById(
            this.vertragspositionen,
            this.editingNewNodeParentId!
          );
          if (parentNode) {
            if (!parentNode.children) parentNode.children = [];
            const savedNode = {
              ...currentNode,
              ...formValues,
              id: created?.id,
              name: displayName,
              personId: formValues.person,
              isPendingCreation: false,
              isNew: false,
            };
            parentNode.children.push(savedNode);
            this.sortNodesByName(parentNode.children);
            parentNode.isExpanded = true;
            this.selectedPosition = savedNode;
          }
          this.finalizeVerbraucherSave();
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERBRAUCHER_CREATED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error creating Verbraucher:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.verbraucher.createFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERBRAUCHER_CREATED_ERROR, 'POST', duration, error);
        },
      });
  } else {
    dto.id = currentNode.id;

    const startTime = Date.now();
    this.vertrageService
      .updateVertragPositionVerbraucher(currentNode.id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          const updateInArray = (arr: VertragTreeNode[], id: string | number, data: Partial<VertragTreeNode>): boolean => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === id) {
                arr[i] = { ...arr[i], ...data };
                this.selectedPosition = arr[i];
                return true;
              }
              if (arr[i].children && updateInArray(arr[i].children!, id, data)) return true;
            }
            return false;
          };

          updateInArray(this.vertragspositionen, currentNode.id, {
            ...formValues,
            name: displayName,
            personId: formValues.person,
          });
          this.finalizeVerbraucherSave();
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERBRAUCHER_UPDATED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error saving Verbraucher:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.verbraucher.saveFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERBRAUCHER_UPDATED_ERROR, 'POST', duration, error);
        },
      });
  }
}

private finalizeVerbraucherSave(): void {
  this.isVerbraucherFormEditable = false;
  this.verbraucherDetailForm.disable();
  this.isNewVerbraucherBeingCreated = false;
  this.verbraucherSubmitAttempted = false;
  if (this.selectedPosition) {
    this.selectedPosition.isNew = false;
    this.selectedPosition.isPendingCreation = false;
  }
  this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.verbraucher.saveSuccess);
}

  private cancelVerbraucherDetails(): void {
    if (!this.selectedPosition) return;

    this.verbraucherSubmitAttempted = false;
    this.isVerbraucherFormEditable = false;
    this.verbraucherDetailForm.patchValue({
      aktiv: this.selectedPosition?.aktiv ?? false,
      verbraucherTyp: this.selectedPosition?.verbraucherTyp || '',
      person: this.selectedPosition?.personId ?? '',
      verbraucher: this.selectedPosition?.verbraucherTyp === 'Sachmittel'
        ? (this.selectedPosition?.name ?? '')
        : '',
      stundensatz: this.selectedPosition?.stundensatz ?? '',
      stundenkontingent: this.selectedPosition?.stundenkontingent ?? '',
      volumenEuro: this.selectedPosition?.volumenEuro ?? '',
      anmerkung: this.selectedPosition?.anmerkung ?? ''
    });
    this.verbraucherDetailForm.disable();
  }

 private saveChildDetails(): void {
  if (!this.selectedPosition) return;
  this.childSubmitAttempted = true;
  if (this.childDetailForm.invalid) {
    this.childDetailForm.markAllAsTouched();
    this.showErrorDialog(
      this.buildRequiredErrorMessage(this.childDetailForm, this.childLabelMap),
      VERTRAG_DETAIL_MESSAGES.dialogTitles.validationError
    );
    return;
  }
  const currentNode = this.selectedPosition;
  const formValues = this.childDetailForm.getRawValue();
  const dto = {} as ApiStundenplanung;
  dto.stundenGeplant = formValues.stundenGeplant?.toString();
  dto.anmerkung = formValues.anmerkung;
dto.produkt = { id: formValues.produkt } as ApiProdukt;
dto.produktPosition = { id: formValues.produktposition } as ApiProduktPosition;
  if (currentNode.isPendingCreation && this.editingNewNodeParentId) {
    const produktPositionId: string = formValues.produktposition ?? '';

    const startTime = Date.now();
    this.vertrageService
      .createStundenplanung(dto, produktPositionId, this.editingNewNodeParentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          const created = response.body;
          const parentNode = this.findNodeById(
            this.vertragspositionen,
            this.editingNewNodeParentId!
          );
          if (parentNode) {
            if (!parentNode.children) parentNode.children = [];
            const selectedProdukt = this.vertragList.find(p => p.id === formValues.produkt);
            const selectedPosition = this.vertragPositionTypenList.find(pp => pp.id === formValues.produktposition);
            parentNode.children.push({
              ...currentNode,
              ...formValues,
              id: created?.id,
              name: formValues.anmerkung || currentNode.name,
              produktPosition: {
                id: formValues.produktposition,
                produktPositionname: selectedPosition?.produktPositionname || formValues.produktposition,
                produkt: {
                  id: formValues.produkt,
                  produktname: selectedProdukt?.produktname || formValues.produkt
                }
              },
              isPendingCreation: false,
              isNew: false,
            });
            this.sortNodesByName(parentNode.children);
            parentNode.isExpanded = true;
          }
          this.finalizeChildSave();
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_STUNDENPLANUNG_CREATED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error creating Stundenplanung:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.stundenplanung.createFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_STUNDENPLANUNG_CREATED_ERROR, 'POST', duration, error);
        },
      });
  } else {
    // UPDATE
    dto.id = currentNode.id;

    const startTime = Date.now();
    this.vertrageService
      .updateStundenplanung(currentNode.id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          const updateInArray = (arr: VertragTreeNode[], id: string | number, data: Partial<VertragTreeNode>): boolean => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === id) {
                arr[i] = { ...arr[i], ...data };
                this.selectedPosition = arr[i];
                return true;
              }
              if (arr[i].children && updateInArray(arr[i].children!, id, data)) return true;
            }
            return false;
          };

          const selectedProdukt = this.vertragList.find(p => p.id === formValues.produkt);
          const selectedPosition = this.vertragPositionTypenList.find(pp => pp.id === formValues.produktposition);
          updateInArray(this.vertragspositionen, currentNode.id, {
            ...formValues,
            name: formValues.anmerkung || currentNode.name,
            produktPosition: {
              id: formValues.produktposition,
              produktPositionname: selectedPosition?.produktPositionname || formValues.produktposition,
              produkt: {
                id: formValues.produkt,
                produktname: selectedProdukt?.produktname || formValues.produkt
              }
            },
          });
          this.finalizeChildSave();
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_STUNDENPLANUNG_UPDATED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error saving Stundenplanung:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.stundenplanung.saveFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_STUNDENPLANUNG_UPDATED_ERROR, 'POST', duration, error);
        },
      });
  }
}

private finalizeChildSave(): void {
  this.isChildFormEditable = false;
  this.childDetailForm.disable({ emitEvent: false });
  this.isNewChildBeingCreated = false;
  this.childSubmitAttempted = false;
  if (this.selectedPosition) this.selectedPosition.isNew = false;
  this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.stundenplanung.saveSuccess);
}


 private cancelChildDetails(): void {
  if (!this.selectedPosition) return;

  this.childSubmitAttempted = false;
  this.isChildFormEditable = false;
  const produktObj = this.selectedPosition.produktPosition?.produkt;
  this.childDetailForm.patchValue({
    produkt: produktObj?.id || produktObj?.produktname || '',
    produktposition:
      this.selectedPosition.produktPosition?.id
      || this.selectedPosition.produktPosition?.produktPositionname
      || '',
    stundenGeplant: this.selectedPosition.stundenGeplant || '',
    anmerkung: this.selectedPosition.anmerkung || '',
    aktiv: this.selectedPosition.aktiv || false
  }, { emitEvent: false });
  this.childDetailForm.disable({ emitEvent: false });
}
  onStundensatzAenderungenChange(entries: StundensatzAenderungEntry[]): void {
    this.stundensatzAenderungen = entries;
    // Mirror the list back into the form control as a serialized summary so
    // the form is still "dirty" and we can persist it via the existing flow.
    const serialized = entries
      .map(e => `${e.aktivierungsdatum} ${(+e.stundensatz).toFixed(2)}`)
      .join('\n');
    this.verbraucherDetailForm.get('StundensatzAnderung')?.setValue(serialized, {
      emitEvent: false,
    });
    this.verbraucherDetailForm.markAsDirty();
  }

  openStundensatzAenderungDialog(): void {
    if (!this.selectedPosition || this.selectedPosition.typ !== 'Verbraucher') return;

    const currentStundensatz =
      this.verbraucherDetailForm.get('stundensatz')?.value
      ?? this.selectedPosition.stundensatz
      ?? null;

    const dialogRef = this.dialog.open(StundensatzAendeungDialogComponent, {
      width: '600px',
      data: {
        currentStundensatz,
        newStundensatz: currentStundensatz,
      },
    });

    dialogRef.afterClosed().subscribe((result: StundensatzAendeungDialogResult | undefined) => {
      if (!result || !result.confirmed) return;
      this.verbraucherDetailForm.patchValue(
        { stundensatz: result.newStundensatz },
        { emitEvent: false }
      );
    });
  }

  openDeleteDialog(): void {
    if (!this.selectedPosition) return;

    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `Löschen eines ${this.selectedPosition.typ}`,
        message: `Wollen Sie den ${this.selectedPosition.typ} "${this.selectedPosition.name}" wirklich löschen?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSelectedPosition();
      }
    });
  }

private deleteSelectedPosition(): void {
  if (!this.selectedPosition) return;

  const id = this.selectedPosition.id;
  const typ = this.selectedPosition.typ;
  const name = this.selectedPosition.name;

  const removeFromArray = (arr: VertragTreeNode[], targetId: string | number): VertragTreeNode[] => {
    return arr.filter(item => {
      if (item.id === targetId) return false;
      if (item.children) {
        item.children = removeFromArray(item.children, targetId);
      }
      return true;
    });
  };

  if (typ === 'Vertragsposition') {
    const dto = {} as ApiVertragPosition;
    dto.id = id;
    dto.position = name;
    dto.aktiv = false;

    const startTime = Date.now();
    this.vertrageService.updateVertragPosition(id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          this.vertragspositionen = removeFromArray(this.vertragspositionen, id);
          this.resetFormsAfterDelete();
          this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.position.deleteSuccess);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERTRAGSPOSITION_DELETED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error deleting Position:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.position.deleteFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERTRAGSPOSITION_DELETED_ERROR, 'POST', duration, error);
        }
      });

  } else if (typ === 'Verbraucher') {
    const dto = {} as ApiVertragPositionVerbraucher;
    dto.id = id;
    dto.aktiv = false;

    const startTime = Date.now();
    this.vertrageService.updateVertragPositionVerbraucher(id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          this.vertragspositionen = removeFromArray(this.vertragspositionen, id);
          this.resetFormsAfterDelete();
          this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.verbraucher.deleteSuccess);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERBRAUCHER_DELETED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error deleting Verbraucher:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.verbraucher.deleteFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_VERBRAUCHER_DELETED_ERROR, 'POST', duration, error);
        }
      });

  } else if (typ === 'Stundenplanung') {
    const dto = {} as ApiStundenplanung;
    dto.id = id;

    const startTime = Date.now();
    this.vertrageService.updateStundenplanung(id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;
          this.vertragspositionen = removeFromArray(this.vertragspositionen, id);
          this.resetFormsAfterDelete();
          this.showInfoDialog(VERTRAG_DETAIL_MESSAGES.stundenplanung.deleteSuccess);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_STUNDENPLANUNG_DELETED_SUCCESS, 'POST', duration, response);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error('Error deleting Stundenplanung:', error);
          this.showErrorDialog(VERTRAG_DETAIL_MESSAGES.stundenplanung.deleteFailed);
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_STUNDENPLANUNG_DELETED_ERROR, 'POST', duration, error);
        }
      });
  }
}
  private resetFormsAfterDelete(): void {
    this.selectedPosition = null;
    this.positionDetailForm.reset();
    this.positionDetailForm.disable();
    this.isPositionFormEditable = false;
    this.verbraucherDetailForm.reset();
    this.verbraucherDetailForm.disable();
    this.isVerbraucherFormEditable = false;
    this.childDetailForm.reset();
    this.childDetailForm.disable();
    this.isChildFormEditable = false;
  }
private findNodeById(nodes: VertragTreeNode[], id: string | number): VertragTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const foundChild = this.findNodeById(node.children, id);
      if (foundChild) {
        return foundChild;
      }
    }
  }
  return null;
}

private cancelAndResetNewFlags(): boolean {
  if (this.isNewPositionBeingCreated || this.isNewVerbraucherBeingCreated || this.isNewChildBeingCreated) {
    if (this.selectedPosition && this.selectedPosition.isNew) {
      this.discardNewPosition(false);
    }
    return true;
  }
  return false;
}
private discardNewPosition(showSnackBar: boolean = true): void {
  if (!this.selectedPosition || !this.selectedPosition.isNew) return;

  const removeFromArray = (arr: VertragTreeNode[], id: string | number): VertragTreeNode[] => {
    return arr.filter(item => {
      if (item.id === id) {
        return false;
      }
      if (item.children) {
        item.children = removeFromArray(item.children, id);
      }
      return true;
    });
  };

  const discardedLevel = this.selectedPosition.level;
  const discardedId = this.selectedPosition.id;
  const discardedParentId = this.editingNewNodeParentId;

  if (discardedLevel === 1) {
    this.vertragspositionen = removeFromArray(this.vertragspositionen, discardedId);
    this.isNewPositionBeingCreated = false;
  } else if (discardedLevel === 2) {
    this.vertragspositionen.forEach(pos => {
      if (pos.children) {
        pos.children = removeFromArray(pos.children, discardedId);
      }
    });
    this.isNewVerbraucherBeingCreated = false;
  } else if (discardedLevel === 3) {
    this.vertragspositionen.forEach(pos => {
      if (pos.children) {
        pos.children.forEach((verbraucher: VertragTreeNode) => {
          if (verbraucher.children) {
            verbraucher.children = removeFromArray(verbraucher.children, discardedId);
          }
        });
      }
    });
    this.isNewChildBeingCreated = false;
  }

  this.selectedPosition = null;
  this.positionDetailForm.reset();
  this.positionDetailForm.disable();
  this.isPositionFormEditable = false;
  this.positionSubmitAttempted = false;
  this.verbraucherDetailForm.reset();
  this.verbraucherDetailForm.disable();
  this.isVerbraucherFormEditable = false;
  this.verbraucherSubmitAttempted = false;
  this.childDetailForm.reset();
  this.childDetailForm.disable();
  this.isChildFormEditable = false;
  this.childSubmitAttempted = false;
  this.editingNewNodeParentId = null;


  if (!showSnackBar && discardedParentId) {
    const parentNode = this.findNodeById(this.vertragspositionen, discardedParentId);
    if (parentNode) {
      this.selectPosition(parentNode);
    }
  }
}

  toggleMenu(): void {
  }
  isEditing: boolean = false;
previousValue: string = '';

onEditStundensatz(): void {
  this.isEditing = true;
  this.previousValue = this.verbraucherDetailForm.get('anmerkung')?.value || '';
}

onSaveStundensatz(): void {
  this.isEditing = false;
  const newValue = this.verbraucherDetailForm.get('anmerkung')?.value;
}

onCancelStundensatz(): void {
  this.isEditing = false;
  this.verbraucherDetailForm.patchValue({
    anmerkung: this.previousValue
  });
}

goToPersonPage(): void {
  this.router.navigate(['/personen'])

}

private showInfoDialog(detail: string, title: string = VERTRAG_DETAIL_MESSAGES.dialogTitles.success): void {
  this.dialog.open(InfoDialogComponent, {
    data: { title, detail },
    panelClass: 'custom-dialog-width'
  });
}

private showErrorDialog(detail: string, title: string = VERTRAG_DETAIL_MESSAGES.dialogTitles.error): void {
  this.dialog.open(ErrorDialogComponent, {
    data: { title, detail },
    panelClass: 'custom-dialog-width'
  });
}

private buildRequiredErrorMessage(form: FormGroup, labelMap: Record<string, string>): string {
  const missing: string[] = [];
  Object.keys(form.controls).forEach((key) => {
    const ctl = form.get(key);
    if (ctl && ctl.invalid) {
      missing.push(labelMap[key] || key);
    }
  });
  if (missing.length === 0) {
    return 'Bitte füllen Sie alle Pflichtfelder aus.';
  }
  return missing.map((label) => `Das Feld '${label}' darf nicht leer sein.`).join('\n');
}

private vertragLabelMap: Record<string, string> = {
  vertragsname: 'Vertragsname',
  vertragszusatz: 'Vertragszusatz',
  vertragspartner: 'Vertragspartner',
  auftraggeber: 'Auftraggeber',
  erstellungsdatum: 'Erstellungsdatum',
  start: 'Gültig von',
  ende: 'Gültig bis',
  vertragssumme: 'Vertragssumme',
  vertragstype: 'Vertragstyp',
};

private positionLabelMap: Record<string, string> = {
  positionsbezeichnung: 'Positionsbezeichnung',
  planungsjahr: 'Planungsjahr',
  volumenEuro: 'Volumen [Euro]',
};

private verbraucherLabelMap: Record<string, string> = {
  verbraucherTyp: 'Verbrauchertyp',
  person: 'Person',
  verbraucher: 'Verbraucher',
  stundensatz: 'Stundensatz inkl. UST.',
  stundenkontingent: 'Stundenkontingent jährlich',
  volumenEuro: 'Volumen [Euro]',
};

private childLabelMap: Record<string, string> = {
  produktposition: 'Produktposition',
  stundenGeplant: 'Stunden geplant',
};

private sortNodesByName(nodes: VertragTreeNode[]): VertragTreeNode[] {
  if (!Array.isArray(nodes)) return nodes;
  nodes.sort((a, b) =>
    (a?.name || '').localeCompare((b?.name || ''), 'de', { sensitivity: 'base' })
  );
  nodes.forEach((node) => {
    if (Array.isArray(node?.children) && node.children.length > 0) {
      this.sortNodesByName(node.children);
    }
  });
  return nodes;
}

}
