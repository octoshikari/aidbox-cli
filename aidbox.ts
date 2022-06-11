export type Reference<T = string> = {
  id: string;
  resourceType: T;
  display?: string;
  identifier: Identifier[];
};

/* The detailed description of a substance, typically at a level beyond what is used for prescribing. */
export interface SubstanceSpecification extends DomainResource, Resource<'SubstanceSpecification'> {
  /* Material or taxonomic/anatomical source for the substance */
  sourceMaterial?: Reference<'SubstanceSourceMaterial'>;
  moiety?: {
    /* Optical activity type */
    opticalActivity?: CodeableConcept;
    /* Stereochemistry type */
    stereochemistry?: CodeableConcept;
    _name?: Element;
    /* Textual name for this moiety substance */
    name?: string;
    /* Quantitative value for this moiety */
    amount?: {
      _string?: Element;
      Quantity?: Quantity;
      string?: string;
    };
    /* Identifier by which this moiety substance is known */
    identifier?: Identifier;
    /* Role that the moiety is playing */
    role?: CodeableConcept;
    /* Molecular formula */
    molecularFormula?: string;
    _molecularFormula?: Element;
  };
  /* Structural information */
  structure?: {
    source?: Array<Reference<'DocumentReference'>>;
    /* Optical activity type */
    opticalActivity?: CodeableConcept;
    isotope?: {
      /* The molecular weight or weight range (for proteins, polymers or nucleic acids) */
      molecularWeight?: {
        /* The method by which the molecular weight was determined */
        method?: CodeableConcept;
        /* Type of molecular weight such as exact, average (also known as. number average), weight average */
        'type'?: CodeableConcept;
        /* Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field */
        amount?: Quantity;
      };
      /* Substance name for each non-natural or radioisotope */
      name?: CodeableConcept;
      /* Half life - for a non-natural nuclide */
      halfLife?: Quantity;
      /* Substance identifier for each non-natural or radioisotope */
      identifier?: Identifier;
      /* The type of isotopic substitution present in a single substance */
      substitution?: CodeableConcept;
    };
    _molecularFormula?: Element;
    /* The molecular weight or weight range (for proteins, polymers or nucleic acids) */
    molecularWeight?: any;
    /* Molecular formula */
    molecularFormula?: string;
    representation?: {
      /* An attached file with the structural representation */
      attachment?: Attachment;
      _representation?: Element;
      /* The structural representation as text string in a format e.g. InChI, SMILES, MOLFILE, CDX */
      representation?: string;
      /* The type of structure (e.g. Full, Partial, Representative) */
      'type'?: CodeableConcept;
    };
    /* Specified per moiety according to the Hill system, i.e. first C, then H, then alphabetical, each moiety separated by a dot */
    molecularFormulaByMoiety?: string;
    /* Stereochemistry type */
    stereochemistry?: CodeableConcept;
    _molecularFormulaByMoiety?: Element;
  };
  _comment?: Element;
  /* Status of substance within the catalogue e.g. approved */
  status?: CodeableConcept;
  /* High level categorization, e.g. polymer or nucleic acid */
  'type'?: CodeableConcept;
  _description?: Element;
  code?: {
    _comment?: Element;
    _statusDate?: Element;
    /* Any comment can be provided in this field, if necessary */
    comment?: string;
    /* The specific code */
    code?: CodeableConcept;
    source?: Array<Reference<'DocumentReference'>>;
    /* Status of the code assignment */
    status?: CodeableConcept;
    /* The date at which the code status is changed as part of the terminology maintenance */
    statusDate?: dateTime;
  };
  /* If the substance applies to only human or veterinary use */
  domain?: CodeableConcept;
  molecularWeight?: any;
  /* Data items specific to proteins */
  protein?: Reference<'SubstanceProtein'>;
  name?: {
    synonym?: any;
    /* If this is the preferred name for this substance */
    preferred?: boolean;
    /* The status of the name */
    status?: CodeableConcept;
    /* Name type */
    'type'?: CodeableConcept;
    domain?: CodeableConcept;
    _name?: Element;
    language?: CodeableConcept;
    _preferred?: Element;
    /* The actual name */
    name: string;
    source?: Array<Reference<'DocumentReference'>>;
    translation?: any;
    official?: {
      _date?: Element;
      /* Date of official name change */
      date?: dateTime;
      /* Which authority uses this official name */
      authority?: CodeableConcept;
      /* The status of the official name */
      status?: CodeableConcept;
    };
    jurisdiction?: CodeableConcept;
  };
  /* Identifier by which this substance is known */
  identifier?: Identifier;
  source?: Array<Reference<'DocumentReference'>>;
  /* Textual description of the substance */
  description?: string;
  /* Textual comment about this record of a substance */
  comment?: string;
  /* Data items specific to polymers */
  polymer?: Reference<'SubstancePolymer'>;
  relationship?: {
    /* A numeric factor for the relationship, for instance to express that the salt of a substance has some percentage of the active substance in relation to some other */
    amount?: {
      Ratio?: Ratio;
      Quantity?: Quantity;
      _string?: Element;
      string?: string;
      Range?: Range;
    };
    /* For example where an enzyme strongly bonds with a particular substance, this is a defining relationship for that enzyme, out of several possible substance relationships */
    isDefining?: boolean;
    /* For use when the numeric */
    amountRatioLowLimit?: Ratio;
    /* An operator for the amount, for example "average", "approximately", "less than" */
    amountType?: CodeableConcept;
    _isDefining?: Element;
    /* A pointer to another substance, as a resource or just a representational code */
    substance?: {
      Reference?: Reference<'SubstanceSpecification'>;
      CodeableConcept?: CodeableConcept;
    };
    /* For example "salt to parent", "active moiety", "starting material" */
    relationship?: CodeableConcept;
    source?: Array<Reference<'DocumentReference'>>;
  };
  property?: {
    /* Property type e.g. viscosity, pH, isoelectric point */
    code?: CodeableConcept;
    /* A category for this property, e.g. Physical, Chemical, Enzymatic */
    category?: CodeableConcept;
    _parameters?: Element;
    /* Quantitative value for this property */
    amount?: {
      Quantity?: Quantity;
      string?: string;
      _string?: Element;
    };
    /* A substance upon which a defining property depends (e.g. for solubility: in water, in alcohol) */
    definingSubstance?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'SubstanceSpecification' | 'Substance'>;
    };
    /* Parameters that were used in the measurement of a property (e.g. for viscosity: measured at 20C with a pH of 7.1) */
    parameters?: string;
  };
  /* Data items specific to nucleic acids */
  nucleicAcid?: Reference<'SubstanceNucleicAcid'>;
  /* General information detailing this substance */
  referenceInformation?: Reference<'SubstanceReferenceInformation'>;
}

/* Identifies two or more records (resource instances) that refer to the same real-world "occurrence". */
export interface Linkage extends DomainResource, Resource<'Linkage'> {
  item: {
    /* source | alternate | historical */
    'type': 'alternate' | 'historical' | 'source';
    _type?: Element;
    /* Resource being linked */
    resource: Reference<'Reference'>;
  };
  _active?: Element;
  /* Whether this linkage assertion is active or not */
  active?: boolean;
  /* Who is responsible for linkages */
  author?: Reference<'Practitioner' | 'Organization' | 'PractitionerRole'>;
}

/* Base StructureDefinition for oid type: An OID represented as a URI */
export type oid = string;
/* This resource allows for the definition of some activity to be performed, independent of a particular patient, practitioner, or other performance context. */
export interface ActivityDefinition extends DomainResource, Resource<'ActivityDefinition'> {
  _approvalDate?: Element;
  /* When the activity definition was last reviewed */
  lastReviewDate?: date;
  topic?: CodeableConcept;
  dosage?: Dosage;
  _transform?: Element;
  /* Describes the clinical usage of the activity definition */
  usage?: string;
  /* How much is administered/consumed/supplied */
  quantity?: Quantity;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  _purpose?: Element;
  /* What's administered/supplied */
  product?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Substance' | 'Medication'>;
  };
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _doNotPerform?: Element;
  _subtitle?: Element;
  relatedArtifact?: RelatedArtifact;
  /* True if the activity should not be performed */
  doNotPerform?: boolean;
  editor?: ContactDetail;
  observationRequirement?: Array<Reference<'ObservationDefinition'>>;
  _date?: Element;
  /* Detail type of activity */
  code?: CodeableConcept;
  dynamicValue?: {
    _path?: Element;
    /* An expression that provides the dynamic value for the customization */
    expression: Expression;
    /* The path to the element to be set dynamically */
    path: string;
  };
  _library?: Element;
  /* Kind of resource */
  kind?:
    | 'Appointment'
    | 'AppointmentResponse'
    | 'CarePlan'
    | 'Claim'
    | 'CommunicationRequest'
    | 'Contract'
    | 'DeviceRequest'
    | 'EnrollmentRequest'
    | 'ImmunizationRecommendation'
    | 'MedicationRequest'
    | 'NutritionOrder'
    | 'ServiceRequest'
    | 'SupplyRequest'
    | 'Task'
    | 'VisionPrescription';
  /* Transform to apply the template */
  transform?: canonical;
  _name?: Element;
  _lastReviewDate?: Element;
  useContext?: UsageContext;
  _profile?: Element;
  /* Where it should happen */
  location?: Reference<'Location'>;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option */
  intent?:
    | 'directive'
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order';
  contact?: ContactDetail;
  /* Name for this activity definition (computer friendly) */
  name?: string;
  _status?: Element;
  specimenRequirement?: Array<Reference<'SpecimenDefinition'>>;
  _kind?: Element;
  /* Canonical identifier for this activity definition, represented as a URI (globally unique) */
  url?: uri;
  jurisdiction?: CodeableConcept;
  library?: canonical;
  /* Type of individual the activity definition is intended for */
  subject?: {
    Reference?: Reference<'Group'>;
    CodeableConcept?: CodeableConcept;
  };
  /* What profile the resource needs to conform to */
  profile?: canonical;
  /* Date last changed */
  date?: dateTime;
  reviewer?: ContactDetail;
  _version?: Element;
  endorser?: ContactDetail;
  _title?: Element;
  /* Why this activity definition is defined */
  purpose?: markdown;
  _url?: Element;
  /* Business version of the activity definition */
  version?: string;
  _copyright?: Element;
  _publisher?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  participant?: {
    /* E.g. Nurse, Surgeon, Parent, etc. */
    role?: CodeableConcept;
    _type?: Element;
    /* patient | practitioner | related-person | device */
    'type': 'device' | 'patient' | 'practitioner' | 'related-person';
  };
  /* When the activity definition was approved by publisher */
  approvalDate?: date;
  identifier?: Identifier;
  /* When activity is to occur */
  timing?: {
    Timing?: Timing;
    Period?: Period;
    _dateTime?: Element;
    dateTime?: dateTime;
    Range?: Range;
    Age?: Age;
    Duration?: Duration;
  };
  _usage?: Element;
  /* Subordinate title of the activity definition */
  subtitle?: string;
  _priority?: Element;
  _intent?: Element;
  bodySite?: CodeableConcept;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* Natural language description of the activity definition */
  description?: markdown;
  /* When the activity definition is expected to be used */
  effectivePeriod?: Period;
  /* Name for this activity definition (human friendly) */
  title?: string;
  author?: ContactDetail;
  observationResultRequirement?: Array<Reference<'ObservationDefinition'>>;
  _description?: Element;
  _experimental?: Element;
}

export interface AthenaDepartment {
  [key: string]: any;
}

export type RPCgetAffectedSlotsBySchedule = {
  method: 'relatient.processing/get-affected-slots-by-schedule';
  params: {
    [key: string]: any;
  };
};
/* Supports automated discovery of OAuth2 endpoints. */
export interface oauthUris {
  /* OAuth2 "authorize" endpoint */
  authorize: uri;
  /* User-facing authorization management entry point */
  manage?: uri;
  /* OAuth2 dynamic registration endpoint */
  register?: uri;
  /* OAuth2 "token" endpoint */
  token: uri;
}

/* The Evidence resource describes the conditional state (population and any exposures being compared within the population) and outcome (if specified) that the knowledge (evidence, assertion, recommendation) is about. */
export interface Evidence extends DomainResource, Resource<'Evidence'> {
  exposureVariant?: Array<Reference<'EvidenceVariable'>>;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  topic?: CodeableConcept;
  note?: Annotation;
  /* Subordinate title of the Evidence */
  subtitle?: string;
  useContext?: UsageContext;
  _shortTitle?: Element;
  _status?: Element;
  /* Business version of the evidence */
  version?: string;
  _version?: Element;
  relatedArtifact?: RelatedArtifact;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _publisher?: Element;
  /* When the evidence is expected to be used */
  effectivePeriod?: Period;
  _description?: Element;
  jurisdiction?: CodeableConcept;
  _copyright?: Element;
  _title?: Element;
  /* Canonical identifier for this evidence, represented as a URI (globally unique) */
  url?: uri;
  contact?: ContactDetail;
  _url?: Element;
  _name?: Element;
  /* Date last changed */
  date?: dateTime;
  _subtitle?: Element;
  /* Name for this evidence (human friendly) */
  title?: string;
  author?: ContactDetail;
  _date?: Element;
  /* Title for use in informal contexts */
  shortTitle?: string;
  identifier?: Identifier;
  /* Name for this evidence (computer friendly) */
  name?: string;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  _approvalDate?: Element;
  editor?: ContactDetail;
  endorser?: ContactDetail;
  /* What population? */
  exposureBackground: Reference<'EvidenceVariable'>;
  /* When the evidence was approved by publisher */
  approvalDate?: date;
  /* Natural language description of the evidence */
  description?: markdown;
  /* When the evidence was last reviewed */
  lastReviewDate?: date;
  _lastReviewDate?: Element;
  outcome?: Array<Reference<'EvidenceVariable'>>;
  reviewer?: ContactDetail;
}

export type RPCsaveInprogressRequest = {
  method: 'relatient.scheduling/save-inprogress-request';
  params: {
    [key: string]: any;
  };
};
/* Simple concise instructions to be read by the patient.  For example  “twice a day” rather than “BID.”. */
export interface devicerequestPatientInstruction {
  /* Text */
  content: string;
  /* Language */
  lang:
    | 'ar'
    | 'bn'
    | 'cs'
    | 'da'
    | 'de'
    | 'de-AT'
    | 'de-CH'
    | 'de-DE'
    | 'el'
    | 'en'
    | 'en-AU'
    | 'en-CA'
    | 'en-GB'
    | 'en-IN'
    | 'en-NZ'
    | 'en-SG'
    | 'en-US'
    | 'es'
    | 'es-AR'
    | 'es-ES'
    | 'es-UY'
    | 'fi'
    | 'fr'
    | 'fr-BE'
    | 'fr-CH'
    | 'fr-FR'
    | 'fy'
    | 'fy-NL'
    | 'hi'
    | 'hr'
    | 'it'
    | 'it-CH'
    | 'it-IT'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'nl-BE'
    | 'nl-NL'
    | 'no'
    | 'no-NO'
    | 'pa'
    | 'pl'
    | 'pt'
    | 'pt-BR'
    | 'ru'
    | 'ru-RU'
    | 'sr'
    | 'sr-RS'
    | 'sv'
    | 'sv-SE'
    | 'te'
    | 'zh'
    | 'zh-CN'
    | 'zh-HK'
    | 'zh-SG'
    | 'zh-TW';
}

/* Base StructureDefinition for CodeableConcept Type: A concept that may be defined by a formal reference to a terminology or ontology or may be provided by text. */
export interface CodeableConcept<T = code> extends Element {
  coding?: Coding;
  /* Plain text representation of the concept */
  text?: string;
  _text?: Element;
}

/* A reply to an appointment request for a patient and/or practitioner(s), such as a confirmation or rejection. */
export interface AppointmentResponse extends DomainResource, Resource<'AppointmentResponse'> {
  /* accepted | declined | tentative | needs-action */
  participantStatus: 'accepted' | 'declined' | 'needs-action' | 'tentative';
  identifier?: Identifier;
  participantType?: CodeableConcept;
  /* Appointment this response relates to */
  appointment: Reference<'Appointment'>;
  _participantStatus?: Element;
  _end?: Element;
  /* Time from appointment, or requested new start time */
  start?: instant;
  _start?: Element;
  /* Person, Location, HealthcareService, or Device */
  actor?: Reference<
    'Practitioner' | 'HealthcareService' | 'Device' | 'Patient' | 'PractitionerRole' | 'Location' | 'RelatedPerson'
  >;
  /* Time from appointment, or requested new end time */
  end?: instant;
  _comment?: Element;
  /* Additional comments */
  comment?: string;
}

export type RPCgenerateSlotsForTest = {
  method: 'dash.demo/generate-slots-for-test';
  params: {
    [key: string]: any;
  };
};
export type RPCgetProviders = {
  method: 'relatient.pmsystem/get-providers';
  params: {
    [key: string]: any;
  };
};
export interface Feature extends Resource<'Feature'> {
  active: boolean;
  product: Reference<'Product'>;
  description?: string;
  name: string;
}

export type RPCsaveResource = {
  method: 'relatient.terminology/save-resource';
  params: {
    [key: string]: any;
  };
};
export interface RoleBinding extends Resource<'RoleBinding'> {
  role: Reference<'Role'>;
  organization: Reference<'Organization'>;
  user: Reference<'User'>;
}

export interface Concept {
  system?: string;
  systemAccount: Reference<'SystemAccount'>;
  code?: string;
  display?: string;
  valueset?: string;
}

/* Base StructureDefinition for url type: A URI that is a literal reference */
export type url = string;
/* Relatient client account definition */
export interface SystemAccount extends Resource<'SystemAccount'> {
  /* Active status */
  active: boolean;
  /* Short name for account */
  alias?: string;
  /* Account name */
  name: string;
  /* Cognito userpool id */
  cognitoUserpoolId?: string;
}

export type RPCgetPrefs = {
  method: 'radix.analytics/get-prefs';
  params: {
    [key: string]: any;
  };
};
/* Logical Model: A pattern to be followed by resources that represent a specific proposal, plan and/or order for some sort of action or service. */
export type Definition = any;
export type RPCbookAppointment = {
  method: 'relatient.scheduling/book-appointment';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for HumanName Type: A human's name with the ability to identify parts and usage. */
export interface HumanName extends Element {
  /* Time period when name was/is in use */
  period?: Period;
  prefix?: string;
  _text?: Element;
  _given?: Element;
  given?: string;
  _prefix?: Element;
  /* Text representation of the full name */
  text?: string;
  /* Family name (often called 'Surname') */
  family?: string;
  _suffix?: Element;
  /* usual | official | temp | nickname | anonymous | old | maiden */
  use?: 'anonymous' | 'maiden' | 'nickname' | 'official' | 'old' | 'temp' | 'usual';
  _use?: Element;
  _family?: Element;
  suffix?: string;
}

/* Base StructureDefinition for markdown type: A string that may contain Github Flavored Markdown syntax for optional processing by a mark down presentation engine */
export type markdown = string;
/* Period or duration of processing. */
export interface specimenProcessingTime {
  Duration?: Duration;
  Period?: Period;
}

/* The minimum number of characters that must be present in the simple data type to be considered a "valid" instance. */
export type minLength = integer;
/* Indicates an actual or potential clinical issue with or between one or more active or proposed clinical actions for a patient; e.g. Drug-drug interaction, Ineffective treatment frequency, Procedure-condition conflict, etc. */
export interface DetectedIssue extends DomainResource, Resource<'DetectedIssue'> {
  /* Description and context */
  detail?: string;
  /* The provider or device that identified the issue */
  author?: Reference<'Practitioner' | 'PractitionerRole' | 'Device'>;
  _severity?: Element;
  identifier?: Identifier;
  /* Associated patient */
  patient?: Reference<'Patient'>;
  _status?: Element;
  mitigation?: {
    /* Who is committing? */
    author?: Reference<'PractitionerRole' | 'Practitioner'>;
    _date?: Element;
    /* What mitigation? */
    action:
      | '1'
      | '10'
      | '11'
      | '12'
      | '13'
      | '14'
      | '15'
      | '16'
      | '17'
      | '18'
      | '19'
      | '2'
      | '20'
      | '21'
      | '22'
      | '23'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '_ActAdministrativeDetectedIssueManagementCode'
      | '_ActDetectedIssueManagementCode'
      | '_AuthorizationIssueManagementCode'
      | 'EMAUTH';
    /* Date committed */
    date?: dateTime;
  };
  /* high | moderate | low */
  severity?: 'high' | 'low' | 'moderate';
  _reference?: Element;
  /* Issue Category, e.g. drug-drug, duplicate therapy, etc. */
  code?:
    | '_ActSuppliedItemDetectedIssueCode'
    | '_AdministrationDetectedIssueCode'
    | 'ALLDONE'
    | 'ALRTENDLATE'
    | 'ALRTSTRTLATE'
    | '_AppropriatenessDetectedIssueCode'
    | 'DACT'
    | 'DRG'
    | 'ENDLATE'
    | 'FOOD'
    | 'FULFIL'
    | 'HELD'
    | 'HISTORIC'
    | '_InteractionDetectedIssueCode'
    | 'INTERVAL'
    | 'MINFREQ'
    | 'NHP'
    | 'NONRX'
    | 'NOTACTN'
    | 'NOTEQUIV'
    | 'NOTEQUIVGEN'
    | 'NOTEQUIVTHER'
    | 'PATPREF'
    | 'PATPREFALT'
    | 'PREVINEF'
    | 'STRTLATE'
    | '_SupplyDetectedIssueCode'
    | 'TIME'
    | 'TIMING'
    | '_TimingDetectedIssueCode'
    | 'TOOLATE'
    | 'TOOSOON'
    | 'TPROD';
  /* Authority for issue */
  reference?: uri;
  _detail?: Element;
  /* When identified */
  identified?: {
    Period?: Period;
    dateTime?: dateTime;
    _dateTime?: Element;
  };
  /* registered | preliminary | final | amended + */
  status:
    | 'amended'
    | 'cancelled'
    | 'corrected'
    | 'entered-in-error'
    | 'final'
    | 'preliminary'
    | 'registered'
    | 'unknown';
  implicated?: Array<Reference<'Reference'>>;
  evidence?: {
    code?: CodeableConcept;
    detail?: Array<Reference<'Reference'>>;
  };
}

/* Base StructureDefinition for Period Type: A time period defined by a start and end date and optionally time. */
export interface Period extends Element {
  _end?: Element;
  /* End time with inclusive boundary, if not ongoing */
  end?: dateTime;
  _start?: Element;
  /* Starting time with inclusive boundary */
  start?: dateTime;
}

/* For attachment answers, indicates the maximum size an attachment can be. */
export type maxSize = decimal;
/* Invoice containing collected ChargeItems from an Account with calculated individual and total price for Billing purpose. */
export interface Invoice extends DomainResource, Resource<'Invoice'> {
  /* draft | issued | balanced | cancelled | entered-in-error */
  status: 'balanced' | 'cancelled' | 'draft' | 'entered-in-error' | 'issued';
  /* Recipient(s) of goods and services */
  subject?: Reference<'Group' | 'Patient'>;
  _paymentTerms?: Element;
  /* Reason for cancellation of this Invoice */
  cancelledReason?: string;
  identifier?: Identifier;
  /* Gross total of this Invoice */
  totalGross?: Money;
  _date?: Element;
  /* Type of Invoice */
  'type'?: CodeableConcept;
  /* Invoice date / posting date */
  date?: dateTime;
  /* Payment details */
  paymentTerms?: markdown;
  _cancelledReason?: Element;
  totalPriceComponent?: any;
  /* Account that is being balanced */
  account?: Reference<'Account'>;
  _status?: Element;
  note?: Annotation;
  participant?: {
    /* Individual who was involved */
    actor: Reference<'RelatedPerson' | 'Patient' | 'Device' | 'Organization' | 'Practitioner' | 'PractitionerRole'>;
    /* Type of involvement in creation of this Invoice */
    role?: CodeableConcept;
  };
  lineItem?: {
    _sequence?: Element;
    priceComponent?: {
      /* base | surcharge | deduction | discount | tax | informational */
      'type': 'base' | 'deduction' | 'discount' | 'informational' | 'surcharge' | 'tax';
      _factor?: Element;
      _type?: Element;
      /* Code identifying the specific component */
      code?: CodeableConcept;
      /* Monetary amount associated with this component */
      amount?: Money;
      /* Factor used for calculating this component */
      factor?: decimal;
    };
    /* Sequence number of line item */
    sequence?: positiveInt;
    /* Reference to ChargeItem containing details of this line item or an inline billing code */
    chargeItem?: {
      Reference?: Reference<'ChargeItem'>;
      CodeableConcept?: CodeableConcept;
    };
  };
  /* Recipient of this invoice */
  recipient?: Reference<'Organization' | 'Patient' | 'RelatedPerson'>;
  /* Net total of this Invoice */
  totalNet?: Money;
  /* Issuing Organization of Invoice */
  issuer?: Reference<'Organization'>;
}

export interface AudienceGroupPatientBinding extends Resource<'AudienceGroupPatientBinding'> {
  patient: Reference<'Patient'>;
  audienceGroup: Reference<'AudienceGroup'>;
}

/* The findings and interpretation of diagnostic  tests performed on patients, groups of patients, devices, and locations, and/or specimens derived from these. The report includes clinical context such as requesting and provider information, and some mix of atomic results, images, textual and coded interpretations, and formatted representation of diagnostic reports. */
export interface DiagnosticReport extends DomainResource, Resource<'DiagnosticReport'> {
  media?: {
    _comment?: Element;
    /* Comment about the image (e.g. explanation) */
    comment?: string;
    /* Reference to the image source */
    link: Reference<'Media'>;
  };
  basedOn?: Array<
    Reference<'ServiceRequest' | 'CarePlan' | 'MedicationRequest' | 'ImmunizationRecommendation' | 'NutritionOrder'>
  >;
  category?: CodeableConcept;
  presentedForm?: Attachment;
  _conclusion?: Element;
  /* registered | partial | preliminary | final + */
  status:
    | 'amended'
    | 'appended'
    | 'cancelled'
    | 'corrected'
    | 'entered-in-error'
    | 'final'
    | 'partial'
    | 'preliminary'
    | 'registered'
    | 'unknown';
  specimen?: Array<Reference<'Specimen'>>;
  /* The subject of the report - usually, but not always, the patient */
  subject?: Reference<'Patient' | 'Group' | 'Device' | 'Location'>;
  _status?: Element;
  /* Clinical conclusion (interpretation) of test results */
  conclusion?: string;
  result?: Array<Reference<'Observation'>>;
  /* Health care event when test ordered */
  encounter?: Reference<'Encounter'>;
  _issued?: Element;
  /* DateTime this version was made */
  issued?: instant;
  /* Name/Code for this diagnostic report */
  code:
    | '10154-3'
    | '10157-6'
    | '10160-0'
    | '10164-2'
    | '10183-2'
    | '10184-0'
    | '10187-3'
    | '10210-3'
    | '10216-0'
    | '10218-6'
    | '10222-8'
    | '10223-6'
    | '11206-0'
    | '11329-0'
    | '11348-0'
    | '11369-6'
    | '11485-0'
    | '11486-8'
    | '11488-4'
    | '11490-0'
    | '11492-6'
    | '11493-4'
    | '11494-2'
    | '11495-9'
    | '11496-7'
    | '11497-5'
    | '11498-3'
    | '11500-6'
    | '11502-2'
    | '11503-0'
    | '11504-8'
    | '11505-5'
    | '11506-3'
    | '11507-1'
    | '11508-9'
    | '11509-7'
    | '11510-5'
    | '11512-1'
    | '11514-7'
    | '11515-4'
    | '11516-2'
    | '11517-0'
    | '11518-8'
    | '11519-6'
    | '11520-4'
    | '11521-2'
    | '11523-8'
    | '11524-6'
    | '11525-3'
    | '11526-1'
    | '11527-9'
    | '11529-5'
    | '11534-5'
    | '11535-2'
    | '11536-0'
    | '11537-8'
    | '11541-0'
    | '11543-6'
    | '13457-7'
    | '13480-9'
    | '14647-2'
    | '15507-7'
    | '15508-5'
    | '16110-9'
    | '16294-1'
    | '1656-8'
    | '17787-3'
    | '18262-6'
    | '18594-2'
    | '18726-0'
    | '18733-6'
    | '18734-4'
    | '18735-1'
    | '18736-9'
    | '18737-7'
    | '18738-5'
    | '18739-3'
    | '18740-1'
    | '18742-7'
    | '18743-5'
    | '18744-3'
    | '18745-0'
    | '18746-8'
    | '18748-4'
    | '18749-2'
    | '18750-0'
    | '18751-8'
    | '18752-6'
    | '18753-4'
    | '18754-2'
    | '18756-7'
    | '18759-1'
    | '18761-7'
    | '18763-3'
    | '18776-5'
    | '18823-5'
    | '18824-3'
    | '18825-0'
    | '18826-8'
    | '18836-7';
  imagingStudy?: Array<Reference<'ImagingStudy'>>;
  /* Clinically relevant time/time-period for report */
  effective?: {
    _dateTime?: Element;
    Period?: Period;
    dateTime?: dateTime;
  };
  resultsInterpreter?: Array<Reference<'CareTeam' | 'Organization' | 'PractitionerRole' | 'Practitioner'>>;
  conclusionCode?: CodeableConcept;
  identifier?: Identifier;
  performer?: Array<Reference<'Organization' | 'PractitionerRole' | 'Practitioner' | 'CareTeam'>>;
}

export type RPCgetAggs = {
  method: 'relatient.prototype.questionnaire/get-aggs';
  params: {
    [key: string]: any;
  };
};
export interface ServiceLink extends Resource<'ServiceLink'> {
  [key: string]: any;
}

export type RPCdashboard = {
  method: 'relatient.terminology/dashboard';
  params: {
    [key: string]: any;
  };
};
/* An invariant that must be satisfied before responses to the questionnaire can be considered "complete". */
export interface questionnaireConstraint {
  /* Formal rule */
  expression: string;
  location?: string;
  /* Unique identifier */
  key: id;
  /* error|warning */
  severity: 'error' | 'warning';
  /* Why needed */
  requirements?: string;
  /* Human-readable rule */
  human: string;
}

/* A formal computable definition of a graph of resources - that is, a coherent set of resources that form a graph by following references. The Graph Definition resource defines a set and makes rules about the set. */
export interface GraphDefinition extends DomainResource, Resource<'GraphDefinition'> {
  _description?: Element;
  _version?: Element;
  _experimental?: Element;
  _publisher?: Element;
  _profile?: Element;
  _date?: Element;
  _start?: Element;
  _purpose?: Element;
  _status?: Element;
  contact?: ContactDetail;
  link?: {
    /* Maximum occurrences for this link */
    max?: string;
    _description?: Element;
    _min?: Element;
    /* Minimum occurrences for this link */
    min?: integer;
    _sliceName?: Element;
    target?: {
      _params?: Element;
      link?: any;
      /* Criteria for reverse lookup */
      params?: string;
      compartment?: {
        _rule?: Element;
        /* identical | matching | different | custom */
        rule: 'custom' | 'different' | 'identical' | 'matching';
        _code?: Element;
        /* Documentation for FHIRPath expression */
        description?: string;
        /* Patient | Encounter | RelatedPerson | Practitioner | Device */
        code: 'Device' | 'Encounter' | 'Patient' | 'Practitioner' | 'RelatedPerson';
        /* condition | requirement */
        use: 'condition' | 'requirement';
        /* Custom rule, as a FHIRPath expression */
        expression?: string;
        _expression?: Element;
        _use?: Element;
        _description?: Element;
      };
      _type?: Element;
      /* Profile for the target resource */
      profile?: canonical;
      _profile?: Element;
      /* Type of resource this link refers to */
      'type':
        | 'Account'
        | 'ActivityDefinition'
        | 'AdverseEvent'
        | 'AllergyIntolerance'
        | 'Appointment'
        | 'AppointmentResponse'
        | 'AuditEvent'
        | 'Basic'
        | 'Binary'
        | 'BiologicallyDerivedProduct'
        | 'BodyStructure'
        | 'Bundle'
        | 'CapabilityStatement'
        | 'CarePlan'
        | 'CareTeam'
        | 'CatalogEntry'
        | 'ChargeItem'
        | 'ChargeItemDefinition'
        | 'Claim'
        | 'ClaimResponse'
        | 'ClinicalImpression'
        | 'CodeSystem'
        | 'Communication'
        | 'CommunicationRequest'
        | 'CompartmentDefinition'
        | 'Composition'
        | 'ConceptMap'
        | 'Condition'
        | 'Consent'
        | 'Contract'
        | 'Coverage'
        | 'CoverageEligibilityRequest'
        | 'CoverageEligibilityResponse'
        | 'DetectedIssue'
        | 'Device'
        | 'DeviceDefinition'
        | 'DeviceMetric'
        | 'DeviceRequest'
        | 'DeviceUseStatement'
        | 'DiagnosticReport'
        | 'DocumentManifest'
        | 'DocumentReference'
        | 'DomainResource'
        | 'EffectEvidenceSynthesis'
        | 'Encounter'
        | 'Endpoint'
        | 'EnrollmentRequest'
        | 'EnrollmentResponse'
        | 'EpisodeOfCare'
        | 'EventDefinition'
        | 'Evidence'
        | 'EvidenceVariable'
        | 'ExampleScenario'
        | 'ExplanationOfBenefit'
        | 'FamilyMemberHistory'
        | 'Flag'
        | 'Goal'
        | 'GraphDefinition'
        | 'Group'
        | 'GuidanceResponse'
        | 'HealthcareService'
        | 'ImagingStudy'
        | 'Immunization'
        | 'ImmunizationEvaluation'
        | 'ImmunizationRecommendation'
        | 'ImplementationGuide'
        | 'InsurancePlan'
        | 'Invoice'
        | 'Library'
        | 'Linkage'
        | 'List'
        | 'Location'
        | 'Measure'
        | 'MeasureReport'
        | 'Media'
        | 'Medication'
        | 'MedicationAdministration'
        | 'MedicationDispense'
        | 'MedicationKnowledge'
        | 'MedicationRequest'
        | 'MedicationStatement'
        | 'MedicinalProduct'
        | 'MedicinalProductAuthorization'
        | 'MedicinalProductContraindication'
        | 'MedicinalProductIndication'
        | 'MedicinalProductIngredient'
        | 'MedicinalProductInteraction'
        | 'MedicinalProductManufactured'
        | 'MedicinalProductPackaged'
        | 'MedicinalProductPharmaceutical'
        | 'MedicinalProductUndesirableEffect'
        | 'MessageDefinition'
        | 'MessageHeader'
        | 'MolecularSequence'
        | 'NamingSystem'
        | 'NutritionOrder'
        | 'Observation'
        | 'ObservationDefinition'
        | 'OperationDefinition'
        | 'OperationOutcome';
    };
    _max?: Element;
    /* Why this link is specified */
    description?: string;
    /* Path in the resource that contains the link */
    path?: string;
    /* Which slice (if profiled) */
    sliceName?: string;
    _path?: Element;
  };
  /* Name for this graph definition (computer friendly) */
  name: string;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Canonical identifier for this graph definition, represented as a URI (globally unique) */
  url?: uri;
  useContext?: UsageContext;
  /* Business version of the graph definition */
  version?: string;
  /* Type of resource at which the graph starts */
  start:
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition'
    | 'DeviceMetric'
    | 'DeviceRequest'
    | 'DeviceUseStatement'
    | 'DiagnosticReport'
    | 'DocumentManifest'
    | 'DocumentReference'
    | 'DomainResource'
    | 'EffectEvidenceSynthesis'
    | 'Encounter'
    | 'Endpoint'
    | 'EnrollmentRequest'
    | 'EnrollmentResponse'
    | 'EpisodeOfCare'
    | 'EventDefinition'
    | 'Evidence'
    | 'EvidenceVariable'
    | 'ExampleScenario'
    | 'ExplanationOfBenefit'
    | 'FamilyMemberHistory'
    | 'Flag'
    | 'Goal'
    | 'GraphDefinition'
    | 'Group'
    | 'GuidanceResponse'
    | 'HealthcareService'
    | 'ImagingStudy'
    | 'Immunization'
    | 'ImmunizationEvaluation'
    | 'ImmunizationRecommendation'
    | 'ImplementationGuide'
    | 'InsurancePlan'
    | 'Invoice'
    | 'Library'
    | 'Linkage'
    | 'List'
    | 'Location'
    | 'Measure'
    | 'MeasureReport'
    | 'Media'
    | 'Medication'
    | 'MedicationAdministration'
    | 'MedicationDispense'
    | 'MedicationKnowledge'
    | 'MedicationRequest'
    | 'MedicationStatement'
    | 'MedicinalProduct'
    | 'MedicinalProductAuthorization'
    | 'MedicinalProductContraindication'
    | 'MedicinalProductIndication'
    | 'MedicinalProductIngredient'
    | 'MedicinalProductInteraction'
    | 'MedicinalProductManufactured'
    | 'MedicinalProductPackaged'
    | 'MedicinalProductPharmaceutical'
    | 'MedicinalProductUndesirableEffect'
    | 'MessageDefinition'
    | 'MessageHeader'
    | 'MolecularSequence'
    | 'NamingSystem'
    | 'NutritionOrder'
    | 'Observation'
    | 'ObservationDefinition'
    | 'OperationDefinition'
    | 'OperationOutcome';
  _name?: Element;
  /* Date last changed */
  date?: dateTime;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  jurisdiction?: CodeableConcept;
  /* Natural language description of the graph definition */
  description?: markdown;
  _url?: Element;
  /* Why this graph definition is defined */
  purpose?: markdown;
  /* Profile on base resource */
  profile?: canonical;
}

export type RPCuploadTerminology = {
  method: 'relatient.terminology/upload-terminology';
  params: {
    [key: string]: any;
  };
};
/* Indicates that a medication product is to be or has been dispensed for a named person/patient.  This includes a description of the medication product (supply) provided and the instructions for administering the medication.  The medication dispense is the result of a pharmacy system responding to a medication order. */
export interface MedicationDispense extends DomainResource, Resource<'MedicationDispense'> {
  note?: Annotation;
  partOf?: Array<Reference<'Procedure'>>;
  supportingInformation?: Array<Reference<'Reference'>>;
  /* Amount dispensed */
  quantity?: Quantity;
  /* Type of medication dispense */
  category?: 'community' | 'discharge' | 'inpatient' | 'outpatient';
  eventHistory?: Array<Reference<'Provenance'>>;
  /* What medication was supplied */
  medication?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Medication'>;
  };
  /* Why a dispense was not performed */
  statusReason?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'DetectedIssue'>;
  };
  authorizingPrescription?: Array<Reference<'MedicationRequest'>>;
  /* When product was given out */
  whenHandedOver?: dateTime;
  performer?: {
    /* Individual who was performing */
    actor: Reference<'Organization' | 'Patient' | 'RelatedPerson' | 'Device' | 'Practitioner' | 'PractitionerRole'>;
    /* Who performed the dispense and what they did */
    function?: CodeableConcept;
  };
  /* Encounter / Episode associated with event */
  context?: Reference<'Encounter' | 'EpisodeOfCare'>;
  receiver?: Array<Reference<'Patient' | 'Practitioner'>>;
  /* preparation | in-progress | cancelled | on-hold | completed | entered-in-error | stopped | declined | unknown */
  status:
    | 'cancelled'
    | 'completed'
    | 'declined'
    | 'entered-in-error'
    | 'in-progress'
    | 'on-hold'
    | 'preparation'
    | 'stopped'
    | 'unknown'
    | 'altchoice'
    | 'clarif'
    | 'drughigh'
    | 'frr01'
    | 'frr02'
    | 'frr03'
    | 'frr04'
    | 'frr05'
    | 'frr06'
    | 'hospadm'
    | 'labint'
    | 'non-avail'
    | 'offmarket'
    | 'outofstock'
    | 'preg'
    | 'saig'
    | 'sddi'
    | 'sdupther'
    | 'sintol'
    | 'surg'
    | 'washout';
  /* Where the medication was sent */
  destination?: Reference<'Location'>;
  /* Whether a substitution was performed on the dispense */
  substitution?: {
    _wasSubstituted?: Element;
    /* Code signifying whether a different drug was dispensed from what was prescribed */
    'type'?: CodeableConcept;
    /* Whether a substitution was or was not performed on the dispense */
    wasSubstituted: boolean;
    reason?: CodeableConcept;
    responsibleParty?: Array<Reference<'PractitionerRole' | 'Practitioner'>>;
  };
  _status?: Element;
  detectedIssue?: Array<Reference<'DetectedIssue'>>;
  identifier?: Identifier;
  /* Trial fill, partial fill, emergency fill, etc. */
  'type'?: CodeableConcept;
  dosageInstruction?: Dosage;
  /* Where the dispense occurred */
  location?: Reference<'Location'>;
  _whenPrepared?: Element;
  /* Amount of medication expressed as a timing amount */
  daysSupply?: Quantity;
  /* Who the dispense is for */
  subject?: Reference<'Group' | 'Patient'>;
  /* When product was packaged and reviewed */
  whenPrepared?: dateTime;
  _whenHandedOver?: Element;
}

/* Establishes a relationship between this goal and other goals. */
export interface goalRelationship {
  /* predecessor | successor | replacement | other */
  'type': CodeableConcept;
  /* Related goal */
  target: Reference<'Goal'>;
}

export type RPCgetDepartment = {
  method: 'relatient.pmsystem/get-department';
  params: {
    'pm-id': string;
    account: string;
    id?: string;
  };
};
/* Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */
export interface SubstanceSourceMaterial extends DomainResource, Resource<'SubstanceSourceMaterial'> {
  parentSubstanceName?: string;
  countryOfOrigin?: CodeableConcept;
  parentSubstanceId?: Identifier;
  partDescription?: {
    /* Entity of anatomical origin of source material within an organism */
    part?: CodeableConcept;
    /* The detailed anatomic location when the part can be extracted from different anatomical locations of the organism. Multiple alternative locations may apply */
    partLocation?: CodeableConcept;
  };
  /* The state of the source material when extracted */
  sourceMaterialState?: CodeableConcept;
  /* This subclause describes the organism which the substance is derived from. For vaccines, the parent organism shall be specified based on these subclause elements. As an example, full taxonomy will be described for the Substance Name: ., Leaf */
  organism?: {
    author?: {
      /* The author of an organism species shall be specified. The author year of an organism shall also be specified when applicable; refers to the year in which the first author(s) published the infraspecific plant/animal name (of any rank) */
      authorDescription?: string;
      /* The type of author of an organism species shall be specified. The parenthetical author of an organism species refers to the first author who published the plant/animal name (of any rank). The primary author of an organism species refers to the first author(s), who validly published the plant/animal name */
      authorType?: CodeableConcept;
      _authorDescription?: Element;
    };
    /* The family of an organism shall be specified */
    family?: CodeableConcept;
    /* The species of an organism shall be specified; refers to the Latin epithet of the species of the plant/animal; it is present in names for species and infraspecies */
    species?: CodeableConcept;
    /* The Intraspecific type of an organism shall be specified */
    intraspecificType?: CodeableConcept;
    /* 4.9.13.7.1 Kingdom (Conditional) */
    organismGeneral?: {
      /* The class of an organism shall be specified */
      class?: CodeableConcept;
      /* The kingdom of an organism shall be specified */
      kingdom?: CodeableConcept;
      /* The phylum of an organism shall be specified */
      phylum?: CodeableConcept;
      /* The order of an organism shall be specified, */
      order?: CodeableConcept;
    };
    /* The genus of an organism shall be specified; refers to the Latin epithet of the genus element of the plant/animal scientific name; it is present in names for genera, species and infraspecies */
    genus?: CodeableConcept;
    /* The intraspecific description of an organism shall be specified based on a controlled vocabulary. For Influenza Vaccine, the intraspecific description shall contain the syntax of the antigen in line with the WHO convention */
    intraspecificDescription?: string;
    /* 4.9.13.8.1 Hybrid species maternal organism ID (Optional) */
    hybrid?: {
      /* The identifier of the maternal species constituting the hybrid organism shall be specified based on a controlled vocabulary. For plants, the parents aren’t always known, and it is unlikely that it will be known which is maternal and which is paternal */
      maternalOrganismId?: string;
      _maternalOrganismId?: Element;
      /* The identifier of the paternal species constituting the hybrid organism shall be specified based on a controlled vocabulary */
      paternalOrganismId?: string;
      _paternalOrganismId?: Element;
      _paternalOrganismName?: Element;
      /* The hybrid type of an organism shall be specified */
      hybridType?: CodeableConcept;
      /* The name of the paternal species constituting the hybrid organism shall be specified */
      paternalOrganismName?: string;
      _maternalOrganismName?: Element;
      /* The name of the maternal species constituting the hybrid organism shall be specified. For plants, the parents aren’t always known, and it is unlikely that it will be known which is maternal and which is paternal */
      maternalOrganismName?: string;
    };
    _intraspecificDescription?: Element;
  };
  /* The organism accepted Scientific name shall be provided based on the organism taxonomy */
  organismName?: string;
  _parentSubstanceName?: Element;
  /* Stage of life for animals, plants, insects and microorganisms. This information shall be provided only when the substance is significantly different in these stages (e.g. foetal bovine serum) */
  developmentStage?: CodeableConcept;
  geographicalLocation?: string;
  /* General high level classification of the source material specific to the origin of the material */
  sourceMaterialClass?: CodeableConcept;
  /* The unique identifier associated with the source material parent organism shall be specified */
  organismId?: Identifier;
  _geographicalLocation?: Element;
  _organismName?: Element;
  fractionDescription?: {
    /* The specific type of the material constituting the component. For Herbal preparations the particulars of the extracts (liquid/dry) is described in Specified Substance Group 1 */
    materialType?: CodeableConcept;
    _fraction?: Element;
    /* This element is capturing information about the fraction of a plant part, or human plasma for fractionation */
    fraction?: string;
  };
  /* The type of the source material shall be specified based on a controlled vocabulary. For vaccines, this subclause refers to the class of infectious agent */
  sourceMaterialType?: CodeableConcept;
}

/* Financial instrument which may be used to reimburse or pay for health care products and services. Includes both insurance and self-payment. */
export interface Coverage extends DomainResource, Resource<'Coverage'> {
  /* Relative order of the coverage */
  order?: positiveInt;
  /* Owner of the policy */
  policyHolder?: Reference<'RelatedPerson' | 'Organization' | 'Patient'>;
  class?: {
    _value?: Element;
    /* Type of class such as 'group' or 'plan' */
    'type': CodeableConcept;
    /* Value associated with the type */
    value: string;
    _name?: Element;
    /* Human readable description of the type and value */
    name?: string;
  };
  costToBeneficiary?: {
    /* The amount or percentage due from the beneficiary */
    value?: {
      Money?: Money;
      Quantity?: Quantity;
    };
    /* Cost category */
    'type'?: CodeableConcept;
    exception?: {
      /* The effective period of the exception */
      period?: Period;
      /* Exception category */
      'type': CodeableConcept;
    };
  };
  /* Insurer network */
  network?: string;
  _status?: Element;
  _network?: Element;
  contract?: Array<Reference<'Contract'>>;
  /* Dependent number */
  dependent?: string;
  _subrogation?: Element;
  _subscriberId?: Element;
  _dependent?: Element;
  _order?: Element;
  /* Plan beneficiary */
  beneficiary: Reference<'Patient'>;
  payor: Array<Reference<'Organization' | 'Patient' | 'RelatedPerson'>>;
  /* Beneficiary relationship to the subscriber */
  relationship?: CodeableConcept;
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  /* Subscriber to the policy */
  subscriber?: Reference<'Patient' | 'RelatedPerson'>;
  identifier?: Identifier;
  /* ID assigned to the subscriber */
  subscriberId?: string;
  /* Reimbursement to insurer */
  subrogation?: boolean;
  /* Coverage category such as medical or accident */
  'type'?:
    | 'pay'
    | '_ActCoverageTypeCode'
    | '_ActHealthInsuranceTypeCode'
    | '_ActInsuranceTypeCode'
    | '_ActProgramTypeCode'
    | 'ANNU'
    | 'AUTOPOL'
    | 'CANPRG'
    | 'CHAR'
    | 'COL'
    | 'CRIME'
    | 'DENTAL'
    | 'DENTPRG'
    | 'DIS'
    | 'DISEASE'
    | 'DISEASEPRG'
    | 'DRUGPOL'
    | 'EAP'
    | 'EHCPOL'
    | 'ENDRENAL'
    | 'EWB'
    | 'FLEXP'
    | 'GOVEMP'
    | 'HIP'
    | 'HIRISK'
    | 'HIVAIDS'
    | 'HMO'
    | 'HSAPOL'
    | 'IND'
    | 'LIFE'
    | 'LTC'
    | 'MANDPOL'
    | 'MCPOL'
    | 'MENTPOL'
    | 'MENTPRG'
    | 'MILITARY'
    | 'PNC'
    | 'POS'
    | 'PPO'
    | 'PUBLICPOL'
    | 'REI'
    | 'RETIRE'
    | 'SAFNET'
    | 'SOCIAL'
    | 'SUBPOL'
    | 'SUBPRG'
    | 'SUBSIDIZ'
    | 'SUBSIDMC'
    | 'SUBSUPP'
    | 'SURPL'
    | 'TLIFE'
    | 'ULIFE'
    | 'UMBRL'
    | 'UNINSMOT'
    | 'VET'
    | 'VISPOL'
    | 'WCBPOL'
    | '_ActInsurancePolicyCode';
  /* Coverage start and end dates */
  period?: Period;
}

/* Information about a person that is involved in the care for a patient, but who is not the target of healthcare, nor has a formal responsibility in the care process. */
export interface RelatedPerson extends DomainResource, Resource<'RelatedPerson'> {
  /* male | female | other | unknown */
  gender?: 'female' | 'male' | 'other' | 'unknown';
  communication?: {
    _preferred?: Element;
    /* Language preference indicator */
    preferred?: boolean;
    /* The language which can be used to communicate with the patient about his or her health */
    language:
      | 'ar'
      | 'bn'
      | 'cs'
      | 'da'
      | 'de'
      | 'de-AT'
      | 'de-CH'
      | 'de-DE'
      | 'el'
      | 'en'
      | 'en-AU'
      | 'en-CA'
      | 'en-GB'
      | 'en-IN'
      | 'en-NZ'
      | 'en-SG'
      | 'en-US'
      | 'es'
      | 'es-AR'
      | 'es-ES'
      | 'es-UY'
      | 'fi'
      | 'fr'
      | 'fr-BE'
      | 'fr-CH'
      | 'fr-FR'
      | 'fy'
      | 'fy-NL'
      | 'hi'
      | 'hr'
      | 'it'
      | 'it-CH'
      | 'it-IT'
      | 'ja'
      | 'ko'
      | 'nl'
      | 'nl-BE'
      | 'nl-NL'
      | 'no'
      | 'no-NO'
      | 'pa'
      | 'pl'
      | 'pt'
      | 'pt-BR'
      | 'ru'
      | 'ru-RU'
      | 'sr'
      | 'sr-RS'
      | 'sv'
      | 'sv-SE'
      | 'te'
      | 'zh'
      | 'zh-CN'
      | 'zh-HK'
      | 'zh-SG'
      | 'zh-TW';
  };
  identifier?: Identifier;
  /* The date on which the related person was born */
  birthDate?: date;
  /* The patient this person is related to */
  patient: Reference<'Patient'>;
  name?: HumanName;
  photo?: Attachment;
  _birthDate?: Element;
  relationship?: Array<CodeableConcept>;
  /* Whether this related person's record is in active use */
  active?: boolean;
  _gender?: Element;
  address?: Address;
  _active?: Element;
  /* Period of time that this relationship is considered valid */
  period?: Period;
  telecom?: ContactPoint;
}

/* The maximum allowable value set, for use when the binding strength is 'extensible' or 'preferred'. This value set is the value set from which additional codes can be taken from. This defines a 'required' binding over the top of the extensible binding. */
export interface elementdefinitionMaxValueSet {
  canonical?: canonical;
  uri?: uri;
}

export type RPCloadAppointmentTypes = {
  method: 'relatient.pmsystem/load-appointment-types';
  params: {
    account: string;
    'pm-id': string;
  };
};
export type RPCdeleteEsIndex = {
  method: 'relatient.processing/delete-es-index';
  params: {
    [key: string]: any;
  };
};
/* A reference to an extensible value set specified in a parent profie in order to allow a conformance checking tool to validate that a code not in the extensible value set of the profile is not violating rules defined by parent profile bindings. */
export interface elementdefinitionInheritedExtensibleValueSet {
  canonical?: canonical;
  uri?: uri;
}

/* Nucleic acids are defined by three distinct elements: the base, sugar and linkage. Individual substance/moiety IDs will be created for each of these elements. The nucleotide sequence will be always entered in the 5’-3’ direction. */
export interface SubstanceNucleicAcid extends DomainResource, Resource<'SubstanceNucleicAcid'> {
  /* (TBC) */
  oligoNucleotideType?: CodeableConcept;
  _areaOfHybridisation?: Element;
  /* The area of hybridisation shall be described if applicable for double stranded RNA or DNA. The number associated with the subunit followed by the number associated to the residue shall be specified in increasing order. The underscore “” shall be used as separator as follows: “Subunitnumber Residue” */
  areaOfHybridisation?: string;
  /* The type of the sequence shall be specified based on a controlled vocabulary */
  sequenceType?: CodeableConcept;
  subunit?: {
    /* (TBC) */
    sequenceAttachment?: Attachment;
    /* Actual nucleotide sequence notation from 5' to 3' end using standard single letter codes. In addition to the base sequence, sugar and type of phosphate or non-phosphate linkage should also be captured */
    sequence?: string;
    /* The length of the sequence shall be captured */
    length?: integer;
    /* The nucleotide present at the 3’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the last position in the sequence. A separate representation would be redundant */
    threePrime?: CodeableConcept;
    /* Index of linear sequences of nucleic acids in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts */
    subunit?: integer;
    sugar?: {
      /* The Substance ID of the sugar or sugar-like component that make up the nucleotide */
      identifier?: Identifier;
      /* The residues that contain a given sugar will be captured. The order of given residues will be captured in the 5‘-3‘direction consistent with the base sequences listed above */
      residueSite?: string;
      _residueSite?: Element;
      _name?: Element;
      /* The name of the sugar or sugar-like component that make up the nucleotide */
      name?: string;
    };
    _subunit?: Element;
    _length?: Element;
    /* The nucleotide present at the 5’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the first position in the sequence. A separate representation would be redundant */
    fivePrime?: CodeableConcept;
    _sequence?: Element;
    linkage?: {
      /* Residues shall be captured as described in 5.3.6.8.3 */
      residueSite?: string;
      /* The entity that links the sugar residues together should also be captured for nearly all naturally occurring nucleic acid the linkage is a phosphate group. For many synthetic oligonucleotides phosphorothioate linkages are often seen. Linkage connectivity is assumed to be 3’-5’. If the linkage is either 3’-3’ or 5’-5’ this should be specified */
      connectivity?: string;
      _name?: Element;
      /* Each linkage will be registered as a fragment and have at least one name. A single name shall be assigned to each linkage */
      name?: string;
      _residueSite?: Element;
      _connectivity?: Element;
      /* Each linkage will be registered as a fragment and have an ID */
      identifier?: Identifier;
    };
  };
  /* The number of linear sequences of nucleotides linked through phosphodiester bonds shall be described. Subunits would be strands of nucleic acids that are tightly associated typically through Watson-Crick base pairing. NOTE: If not specified in the reference source, the assumption is that there is 1 subunit */
  numberOfSubunits?: integer;
  _numberOfSubunits?: Element;
}

/* A collection of error, warning, or information messages that result from a system action. */
export interface OperationOutcome extends DomainResource, Resource<'OperationOutcome'> {
  issue: {
    _code?: Element;
    location?: string;
    /* Error or warning code */
    code:
      | 'business-rule'
      | 'code-invalid'
      | 'conflict'
      | 'deleted'
      | 'duplicate'
      | 'exception'
      | 'expired'
      | 'extension'
      | 'forbidden'
      | 'incomplete'
      | 'informational'
      | 'invalid'
      | 'invariant'
      | 'lock-error'
      | 'login'
      | 'multiple-matches'
      | 'no-store'
      | 'not-found'
      | 'not-supported'
      | 'processing'
      | 'required'
      | 'security'
      | 'structure'
      | 'suppressed'
      | 'throttled'
      | 'timeout'
      | 'too-costly'
      | 'too-long'
      | 'transient'
      | 'unknown'
      | 'value';
    _expression?: Element;
    _diagnostics?: Element;
    _severity?: Element;
    /* Additional details about the error */
    details?: CodeableConcept;
    /* fatal | error | warning | information */
    severity: 'error' | 'fatal' | 'information' | 'warning';
    /* Additional diagnostic information about the issue */
    diagnostics?: string;
    expression?: string;
    _location?: Element;
  };
}

export interface CodeSystem extends DomainResource, Resource<'CodeSystem'> {
  _caseSensitive?: Element;
  _experimental?: Element;
  _title?: Element;
  _valueSet?: Element;
  /* If definitions are not stable */
  versionNeeded?: boolean;
  /* not-present | example | fragment | complete | supplement */
  content: 'complete' | 'example' | 'fragment' | 'not-present' | 'supplement';
  _hierarchyMeaning?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Business version of the code system (Coding.version) */
  version?: string;
  /* Total concepts in the code system */
  count?: unsignedInt;
  /* If code comparison is case sensitive */
  caseSensitive?: boolean;
  _supplements?: Element;
  _copyright?: Element;
  _status?: Element;
  _description?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  concept?: {
    designation?: {
      _language?: Element;
      /* Human language of the designation */
      language?:
        | 'ar'
        | 'bn'
        | 'cs'
        | 'da'
        | 'de'
        | 'de-AT'
        | 'de-CH'
        | 'de-DE'
        | 'el'
        | 'en'
        | 'en-AU'
        | 'en-CA'
        | 'en-GB'
        | 'en-IN'
        | 'en-NZ'
        | 'en-SG'
        | 'en-US'
        | 'es'
        | 'es-AR'
        | 'es-ES'
        | 'es-UY'
        | 'fi'
        | 'fr'
        | 'fr-BE'
        | 'fr-CH'
        | 'fr-FR'
        | 'fy'
        | 'fy-NL'
        | 'hi'
        | 'hr'
        | 'it'
        | 'it-CH'
        | 'it-IT'
        | 'ja'
        | 'ko'
        | 'nl'
        | 'nl-BE'
        | 'nl-NL'
        | 'no'
        | 'no-NO'
        | 'pa'
        | 'pl'
        | 'pt'
        | 'pt-BR'
        | 'ru'
        | 'ru-RU'
        | 'sr'
        | 'sr-RS'
        | 'sv'
        | 'sv-SE'
        | 'te'
        | 'zh'
        | 'zh-CN'
        | 'zh-HK'
        | 'zh-SG'
        | 'zh-TW';
      /* Details how this designation would be used */
      use?: Coding;
      _value?: Element;
      /* The text value for this designation */
      value: string;
    };
    /* Code that identifies concept */
    code: code;
    _code?: Element;
    /* Text to display to the user */
    display?: string;
    property?: {
      _code?: Element;
      /* Reference to CodeSystem.property.code */
      code: code;
      /* Value of the property for this concept */
      value?: {
        boolean?: boolean;
        decimal?: decimal;
        integer?: integer;
        string?: string;
        Coding?: Coding;
        dateTime?: dateTime;
        _string?: Element;
        _decimal?: Element;
        _dateTime?: Element;
        code?: code;
        _boolean?: Element;
        _code?: Element;
        _integer?: Element;
      };
    };
    /* Formal definition */
    definition?: string;
    _display?: Element;
    concept?: any;
    _definition?: Element;
  };
  filter?: {
    _code?: Element;
    _operator?: Element;
    /* What to use for the value */
    value: string;
    /* How or why the filter is used */
    description?: string;
    _value?: Element;
    operator: Array<'=' | 'descendent-of' | 'exists' | 'generalizes' | 'in' | 'is-a' | 'is-not-a' | 'not-in' | 'regex'>;
    _description?: Element;
    /* Code that identifies the filter */
    code: code;
  };
  jurisdiction?: CodeableConcept;
  _publisher?: Element;
  _content?: Element;
  /* Name for this code system (computer friendly) */
  name?: string;
  property?: {
    _type?: Element;
    _code?: Element;
    _description?: Element;
    /* Why the property is defined, and/or what it conveys */
    description?: string;
    /* Formal identifier for the property */
    uri?: uri;
    _uri?: Element;
    /* Identifies the property on the concepts, and when referred to in operations */
    code: code;
    /* code | Coding | string | integer | boolean | dateTime | decimal */
    'type': 'boolean' | 'code' | 'Coding' | 'dateTime' | 'decimal' | 'integer' | 'string';
  };
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _purpose?: Element;
  _versionNeeded?: Element;
  contact?: ContactDetail;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Canonical URL of Code System this adds designations and properties to */
  supplements?: canonical;
  useContext?: UsageContext;
  _date?: Element;
  _url?: Element;
  /* Natural language description of the code system */
  description?: markdown;
  /* Name for this code system (human friendly) */
  title?: string;
  _compositional?: Element;
  _version?: Element;
  /* Canonical reference to the value set with entire code system */
  valueSet?: canonical;
  /* grouped-by | is-a | part-of | classified-with */
  hierarchyMeaning?: 'classified-with' | 'grouped-by' | 'is-a' | 'part-of';
  _count?: Element;
  /* Why this code system is defined */
  purpose?: markdown;
  _name?: Element;
  identifier?: Identifier;
  /* Canonical identifier for this code system, represented as a URI (globally unique) (Coding.system) */
  url?: uri;
  /* Date last changed */
  date?: dateTime;
  /* If code system defines a compositional grammar */
  compositional?: boolean;
}

/* Details of a Health Insurance product/plan provided by an organization. */
export interface InsurancePlan extends DomainResource, Resource<'InsurancePlan'> {
  /* When the product is available */
  period?: Period;
  network?: Array<Reference<'Organization'>>;
  plan?: {
    network?: Array<Reference<'Organization'>>;
    identifier?: Identifier;
    coverageArea?: Array<Reference<'Location'>>;
    generalCost?: {
      _groupSize?: Element;
      /* Type of cost */
      'type'?: CodeableConcept;
      _comment?: Element;
      /* Cost value */
      cost?: Money;
      /* Additional cost information */
      comment?: string;
      /* Number of enrollees */
      groupSize?: positiveInt;
    };
    specificCost?: {
      benefit?: {
        /* Type of specific benefit */
        'type': CodeableConcept;
        cost?: {
          /* The actual cost value */
          value?: Quantity;
          /* in-network | out-of-network | other */
          applicability?: 'in-network' | 'other' | 'out-of-network';
          qualifiers?: CodeableConcept;
          /* Type of cost */
          'type': CodeableConcept;
        };
      };
      /* General category of benefit */
      category: CodeableConcept;
    };
    /* Type of plan */
    'type'?: CodeableConcept;
  };
  /* Product administrator */
  administeredBy?: Reference<'Organization'>;
  /* draft | active | retired | unknown */
  status?: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  identifier?: Identifier;
  coverage?: {
    benefit: {
      /* Referral requirements */
      requirement?: string;
      /* Type of benefit */
      'type': CodeableConcept;
      limit?: {
        /* Benefit limit details */
        code?: CodeableConcept;
        /* Maximum value allowed */
        value?: Quantity;
      };
      _requirement?: Element;
    };
    /* Type of coverage */
    'type': CodeableConcept;
    network?: Array<Reference<'Organization'>>;
  };
  endpoint?: Array<Reference<'Endpoint'>>;
  /* Official name */
  name?: string;
  _status?: Element;
  alias?: string;
  'type'?: CodeableConcept;
  _alias?: Element;
  /* Plan issuer */
  ownedBy?: Reference<'Organization'>;
  _name?: Element;
  contact?: {
    telecom?: ContactPoint;
    /* Visiting or postal addresses for the contact */
    address?: Address;
    /* A name associated with the contact */
    name?: HumanName;
    /* The type of contact */
    purpose?: CodeableConcept;
  };
  coverageArea?: Array<Reference<'Location'>>;
}

/* A curated namespace that issues unique symbols within that namespace for the identification of concepts, people, devices, etc.  Represents a "System" used within the Identifier and Coding data types. */
export interface NamingSystem extends DomainResource, Resource<'NamingSystem'> {
  /* Natural language description of the naming system */
  description?: markdown;
  _date?: Element;
  _publisher?: Element;
  jurisdiction?: CodeableConcept;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* e.g. driver,  provider,  patient, bank etc. */
  'type'?: CodeableConcept;
  _name?: Element;
  uniqueId: {
    /* oid | uuid | uri | other */
    'type': 'oid' | 'other' | 'uri' | 'uuid';
    _value?: Element;
    /* Is this the id that should be used for this type */
    preferred?: boolean;
    _type?: Element;
    _preferred?: Element;
    /* When is identifier valid? */
    period?: Period;
    /* The unique identifier */
    value: string;
    /* Notes about identifier usage */
    comment?: string;
    _comment?: Element;
  };
  _responsible?: Element;
  _description?: Element;
  contact?: ContactDetail;
  /* Date last changed */
  date: dateTime;
  /* How/where is it used */
  usage?: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _usage?: Element;
  /* Who maintains system namespace? */
  responsible?: string;
  _status?: Element;
  /* Name for this naming system (computer friendly) */
  name: string;
  _kind?: Element;
  useContext?: UsageContext;
  /* codesystem | identifier | root */
  kind: 'codesystem' | 'identifier' | 'root';
}

/* Prospective warnings of potential issues when providing care to the patient. */
export interface Flag extends DomainResource, Resource<'Flag'> {
  category?: CodeableConcept;
  /* active | inactive | entered-in-error */
  status: 'active' | 'entered-in-error' | 'inactive';
  /* Flag creator */
  author?: Reference<'Practitioner' | 'PractitionerRole' | 'Device' | 'Organization' | 'Patient'>;
  /* Coded or textual message to display to user */
  code: CodeableConcept;
  /* Who/What is flag about? */
  subject: Reference<
    'Medication' | 'Practitioner' | 'PlanDefinition' | 'Organization' | 'Location' | 'Group' | 'Patient' | 'Procedure'
  >;
  /* Alert relevant during encounter */
  encounter?: Reference<'Encounter'>;
  _status?: Element;
  identifier?: Identifier;
  /* Time period when flag is active */
  period?: Period;
}

export interface Composition extends DomainResource, Resource<'Composition'> {
  /* Version-independent identifier for the Composition */
  identifier?: Identifier;
  section?: {
    /* Order of section entries */
    orderedBy?: 'alphabetic' | 'category' | 'entry-date' | 'event-date' | 'patient' | 'priority' | 'system' | 'user';
    entry?: Array<Reference<'Reference'>>;
    /* working | snapshot | changes */
    mode?: 'changes' | 'snapshot' | 'working';
    section?: any;
    /* Classification of section (recommended) */
    code?: CodeableConcept;
    /* Label for section (e.g. for ToC) */
    title?: string;
    _title?: Element;
    author?: Array<
      Reference<'PractitionerRole' | 'Organization' | 'Patient' | 'Practitioner' | 'RelatedPerson' | 'Device'>
    >;
    /* Text summary of the section, for human interpretation */
    text?: Narrative;
    /* Why the section is empty */
    emptyReason?: 'closed' | 'nilknown' | 'notasked' | 'notstarted' | 'unavailable' | 'withheld';
    /* Who/what the section is about, when it is not about the subject of composition */
    focus?: Reference<'Reference'>;
    _mode?: Element;
  };
  category?: CodeableConcept;
  _title?: Element;
  _date?: Element;
  /* preliminary | final | amended | entered-in-error */
  status: 'amended' | 'entered-in-error' | 'final' | 'preliminary';
  /* Human Readable name/title */
  title: string;
  /* Kind of composition (LOINC if possible) */
  'type': 'CodeableConcept';
  attester?: {
    _time?: Element;
    /* Who attested the composition */
    party?: Reference<'PractitionerRole' | 'Practitioner' | 'Patient' | 'Organization' | 'RelatedPerson'>;
    /* personal | professional | legal | official */
    mode: 'legal' | 'official' | 'personal' | 'professional';
    _mode?: Element;
    /* When the composition was attested */
    time?: dateTime;
  };
  /* Organization which maintains the composition */
  custodian?: Reference<'Organization'>;
  /* Context of the Composition */
  encounter?: Reference<'Encounter'>;
  /* As defined by affinity domain */
  confidentiality?: 'L' | 'M' | 'N' | 'R' | 'U' | 'V';
  _confidentiality?: Element;
  relatesTo?: {
    /* Target of the relationship */
    target?: {
      Reference?: Reference<'Composition'>;
      Identifier?: Identifier;
    };
    _code?: Element;
    /* replaces | transforms | signs | appends */
    code: 'appends' | 'replaces' | 'signs' | 'transforms';
  };
  /* Composition editing time */
  date: dateTime;
  event?: {
    detail?: Array<Reference<'Reference'>>;
    code?: CodeableConcept;
    /* The period covered by the documentation */
    period?: Period;
  };
  /* Who and/or what the composition is about */
  subject?: Reference<'Reference'>;
  author: Array<
    Reference<'Practitioner' | 'Organization' | 'PractitionerRole' | 'RelatedPerson' | 'Patient' | 'Device'>
  >;
  _status?: Element;
}

/* Provenance of a resource is a record that describes entities and processes involved in producing and delivering or otherwise influencing that resource. Provenance provides a critical foundation for assessing authenticity, enabling trust, and allowing reproducibility. Provenance assertions are a form of contextual metadata and can themselves become important records with their own provenance. Provenance statement indicates clinical significance in terms of confidence in authenticity, reliability, and trustworthiness, integrity, and stage in lifecycle (e.g. Document Completion - has the artifact been legally authenticated), all of which may impact security, privacy, and trust policies. */
export interface Provenance extends DomainResource, Resource<'Provenance'> {
  /* When the activity was recorded / updated */
  recorded: instant;
  signature?: Signature;
  target: Array<Reference<'Reference'>>;
  /* When the activity occurred */
  occurred?: {
    Period?: Period;
    _dateTime?: Element;
    dateTime?: dateTime;
  };
  entity?: {
    /* derivation | revision | quotation | source | removal */
    role: 'derivation' | 'quotation' | 'removal' | 'revision' | 'source';
    /* Identity of entity */
    what: Reference<'Reference'>;
    agent?: any;
    _role?: Element;
  };
  _policy?: Element;
  policy?: uri;
  /* Where the activity occurred, if relevant */
  location?: Reference<'Location'>;
  _recorded?: Element;
  agent: {
    /* Who participated */
    who: Reference<'PractitionerRole' | 'Practitioner' | 'RelatedPerson' | 'Patient' | 'Device' | 'Organization'>;
    /* Who the agent is representing */
    onBehalfOf?: Reference<
      'Organization' | 'Device' | 'RelatedPerson' | 'PractitionerRole' | 'Patient' | 'Practitioner'
    >;
    role?: CodeableConcept;
    /* How the agent participated */
    'type'?: CodeableConcept;
  };
  /* Activity that occurred */
  activity?: CodeableConcept;
  reason?: CodeableConcept;
}

/* A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection. */
export interface Questionnaire extends DomainResource, Resource<'Questionnaire'> {
  contact?: ContactDetail;
  _status?: Element;
  /* When the questionnaire is expected to be used */
  effectivePeriod?: Period;
  useContext?: UsageContext;
  item?: {
    /* No more than this many characters */
    maxLength?: integer;
    answerOption?: {
      /* Whether option is selected by default */
      initialSelected?: boolean;
      _initialSelected?: Element;
      /* Answer value */
      value?: {
        Coding?: Coding;
        Reference?: Reference<'Reference'>;
        _integer?: Element;
        _time?: Element;
        _string?: Element;
        _date?: Element;
        string?: string;
        time?: time;
        date?: date;
        integer?: integer;
      };
    };
    _text?: Element;
    /* Unique id for item in questionnaire */
    linkId: string;
    /* Whether the item may repeat */
    repeats?: boolean;
    _maxLength?: Element;
    _required?: Element;
    _enableBehavior?: Element;
    /* all | any */
    enableBehavior?: 'all' | 'any';
    _repeats?: Element;
    code?: Coding;
    enableWhen?: {
      /* Question that determines whether item is enabled */
      question: string;
      _operator?: Element;
      /* exists | = | != | > | < | >= | <= */
      operator: '!=' | '<' | '<=' | '=' | '>' | '>=' | 'exists';
      /* Value for question comparison based on operator */
      answer?: {
        _time?: Element;
        _integer?: Element;
        boolean?: boolean;
        dateTime?: dateTime;
        time?: time;
        string?: string;
        Quantity?: Quantity;
        _decimal?: Element;
        Reference?: Reference<'Reference'>;
        _date?: Element;
        _dateTime?: Element;
        _string?: Element;
        decimal?: decimal;
        date?: date;
        _boolean?: Element;
        Coding?: Coding;
        integer?: integer;
      };
      _question?: Element;
    };
    _readOnly?: Element;
    _linkId?: Element;
    _prefix?: Element;
    item?: any;
    /* Whether the item must be included in data results */
    required?: boolean;
    _definition?: Element;
    _answerValueSet?: Element;
    /* Valueset containing permitted answers */
    answerValueSet?: canonical;
    initial?: {
      /* Actual value for initializing the question */
      value?: {
        Coding?: Coding;
        _boolean?: Element;
        date?: date;
        dateTime?: dateTime;
        _date?: Element;
        boolean?: boolean;
        _string?: Element;
        Reference?: Reference<'Reference'>;
        time?: time;
        uri?: uri;
        decimal?: decimal;
        integer?: integer;
        Attachment?: Attachment;
        _uri?: Element;
        string?: string;
        _time?: Element;
        _dateTime?: Element;
        _integer?: Element;
        _decimal?: Element;
        Quantity?: Quantity;
      };
    };
    _type?: Element;
    /* E.g. "1(a)", "2.5.3" */
    prefix?: string;
    /* Primary text for the item */
    text?: string;
    /* group | display | boolean | decimal | integer | date | dateTime + */
    'type':
      | 'attachment'
      | 'boolean'
      | 'choice'
      | 'date'
      | 'dateTime'
      | 'decimal'
      | 'display'
      | 'group'
      | 'integer'
      | 'open-choice'
      | 'quantity'
      | 'question'
      | 'reference'
      | 'string'
      | 'text'
      | 'time'
      | 'url';
    /* ElementDefinition - details for the item */
    definition?: uri;
    /* Don't allow human editing */
    readOnly?: boolean;
  };
  jurisdiction?: CodeableConcept;
  _version?: Element;
  _title?: Element;
  _url?: Element;
  /* Date last changed */
  date?: dateTime;
  /* Business version of the questionnaire */
  version?: string;
  _copyright?: Element;
  _description?: Element;
  _subjectType?: Element;
  _derivedFrom?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  identifier?: Identifier;
  /* Canonical identifier for this questionnaire, represented as a URI (globally unique) */
  url?: uri;
  _name?: Element;
  /* When the questionnaire was approved by publisher */
  approvalDate?: date;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _lastReviewDate?: Element;
  _experimental?: Element;
  code?: Coding;
  /* Natural language description of the questionnaire */
  description?: markdown;
  _approvalDate?: Element;
  /* Why this questionnaire is defined */
  purpose?: markdown;
  /* When the questionnaire was last reviewed */
  lastReviewDate?: date;
  /* Name for this questionnaire (computer friendly) */
  name?: string;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _date?: Element;
  _publisher?: Element;
  _purpose?: Element;
  derivedFrom?: canonical;
  /* Name for this questionnaire (human friendly) */
  title?: string;
  subjectType?: Array<
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition'
    | 'DeviceMetric'
    | 'DeviceRequest'
    | 'DeviceUseStatement'
    | 'DiagnosticReport'
    | 'DocumentManifest'
    | 'DocumentReference'
    | 'DomainResource'
    | 'EffectEvidenceSynthesis'
    | 'Encounter'
    | 'Endpoint'
    | 'EnrollmentRequest'
    | 'EnrollmentResponse'
    | 'EpisodeOfCare'
    | 'EventDefinition'
    | 'Evidence'
    | 'EvidenceVariable'
    | 'ExampleScenario'
    | 'ExplanationOfBenefit'
    | 'FamilyMemberHistory'
    | 'Flag'
    | 'Goal'
    | 'GraphDefinition'
    | 'Group'
    | 'GuidanceResponse'
    | 'HealthcareService'
    | 'ImagingStudy'
    | 'Immunization'
    | 'ImmunizationEvaluation'
    | 'ImmunizationRecommendation'
    | 'ImplementationGuide'
    | 'InsurancePlan'
    | 'Invoice'
    | 'Library'
    | 'Linkage'
    | 'List'
    | 'Location'
    | 'Measure'
    | 'MeasureReport'
    | 'Media'
    | 'Medication'
    | 'MedicationAdministration'
    | 'MedicationDispense'
    | 'MedicationKnowledge'
    | 'MedicationRequest'
    | 'MedicationStatement'
    | 'MedicinalProduct'
    | 'MedicinalProductAuthorization'
    | 'MedicinalProductContraindication'
    | 'MedicinalProductIndication'
    | 'MedicinalProductIngredient'
    | 'MedicinalProductInteraction'
    | 'MedicinalProductManufactured'
    | 'MedicinalProductPackaged'
    | 'MedicinalProductPharmaceutical'
    | 'MedicinalProductUndesirableEffect'
    | 'MessageDefinition'
    | 'MessageHeader'
    | 'MolecularSequence'
    | 'NamingSystem'
    | 'NutritionOrder'
    | 'Observation'
    | 'ObservationDefinition'
    | 'OperationDefinition'
    | 'OperationOutcome'
  >;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
}

/* Represents a defined collection of entities that may be discussed or acted upon collectively but which are not expected to act collectively, and are not formally or legally recognized; i.e. a collection of entities that isn't an Organization. */
export interface Group extends DomainResource, Resource<'Group'> {
  /* person | animal | practitioner | device | medication | substance */
  'type': 'animal' | 'device' | 'medication' | 'person' | 'practitioner' | 'substance';
  /* Entity that is the custodian of the Group's definition */
  managingEntity?: Reference<'RelatedPerson' | 'Organization' | 'PractitionerRole' | 'Practitioner'>;
  _actual?: Element;
  member?: {
    /* If member is no longer in group */
    inactive?: boolean;
    /* Reference to the group member */
    entity: Reference<
      'Patient' | 'PractitionerRole' | 'Substance' | 'Practitioner' | 'Group' | 'Medication' | 'Device'
    >;
    _inactive?: Element;
    /* Period member belonged to the group */
    period?: Period;
  };
  _name?: Element;
  /* Number of members */
  quantity?: unsignedInt;
  /* Kind of Group members */
  code?: CodeableConcept;
  _active?: Element;
  /* Whether this group's record is in active use */
  active?: boolean;
  _type?: Element;
  /* Descriptive or actual */
  actual: boolean;
  identifier?: Identifier;
  /* Label for Group */
  name?: string;
  characteristic?: {
    _exclude?: Element;
    /* Group includes or excludes */
    exclude: boolean;
    /* Period over which characteristic is tested */
    period?: Period;
    /* Kind of characteristic */
    code: CodeableConcept;
    /* Value held by characteristic */
    value?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Reference'>;
      _boolean?: Element;
      boolean?: boolean;
      Quantity?: Quantity;
      Range?: Range;
    };
  };
  _quantity?: Element;
}

/* This is the base resource type for everything. */
export interface Resource<T = string> {
  /* Logical id of this artifact */
  id?: string;
  /* Language of the resource content */
  language?:
    | 'ar'
    | 'bn'
    | 'cs'
    | 'da'
    | 'de'
    | 'de-AT'
    | 'de-CH'
    | 'de-DE'
    | 'el'
    | 'en'
    | 'en-AU'
    | 'en-CA'
    | 'en-GB'
    | 'en-IN'
    | 'en-NZ'
    | 'en-SG'
    | 'en-US'
    | 'es'
    | 'es-AR'
    | 'es-ES'
    | 'es-UY'
    | 'fi'
    | 'fr'
    | 'fr-BE'
    | 'fr-CH'
    | 'fr-FR'
    | 'fy'
    | 'fy-NL'
    | 'hi'
    | 'hr'
    | 'it'
    | 'it-CH'
    | 'it-IT'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'nl-BE'
    | 'nl-NL'
    | 'no'
    | 'no-NO'
    | 'pa'
    | 'pl'
    | 'pt'
    | 'pt-BR'
    | 'ru'
    | 'ru-RU'
    | 'sr'
    | 'sr-RS'
    | 'sv'
    | 'sv-SE'
    | 'te'
    | 'zh'
    | 'zh-CN'
    | 'zh-HK'
    | 'zh-SG'
    | 'zh-TW';
  _language?: Element;
  resourceType: T;
  _id?: Element;
  /* A set of rules under which this content was created */
  implicitRules?: uri;
  _implicitRules?: Element;
  /* Metadata about the resource */
  meta?: Meta;
}

/* An authorization for the provision of glasses and/or contact lenses to a patient. */
export interface VisionPrescription extends DomainResource, Resource<'VisionPrescription'> {
  /* Who authorized the vision prescription */
  prescriber: Reference<'Practitioner' | 'PractitionerRole'>;
  /* When prescription was authorized */
  dateWritten: dateTime;
  _created?: Element;
  lensSpecification: {
    /* Lens wear duration */
    duration?: Quantity;
    /* right | left */
    eye: 'left' | 'right';
    /* Contact lens power */
    power?: decimal;
    /* Product to be supplied */
    product: CodeableConcept;
    /* Color required */
    color?: string;
    _sphere?: Element;
    /* Added power for multifocal levels */
    add?: decimal;
    /* Lens power for astigmatism */
    cylinder?: decimal;
    /* Power of the lens */
    sphere?: decimal;
    _diameter?: Element;
    _power?: Element;
    _brand?: Element;
    _backCurve?: Element;
    note?: Annotation;
    _cylinder?: Element;
    _eye?: Element;
    /* Brand required */
    brand?: string;
    _color?: Element;
    _add?: Element;
    /* Lens meridian which contain no power for astigmatism */
    axis?: integer;
    prism?: {
      /* up | down | in | out */
      base: 'down' | 'in' | 'out' | 'up';
      _base?: Element;
      _amount?: Element;
      /* Amount of adjustment */
      amount: decimal;
    };
    /* Contact lens back curvature */
    backCurve?: decimal;
    /* Contact lens diameter */
    diameter?: decimal;
    _axis?: Element;
  };
  _status?: Element;
  /* Who prescription is for */
  patient: Reference<'Patient'>;
  identifier?: Identifier;
  _dateWritten?: Element;
  /* Response creation date */
  created: dateTime;
  /* Created during encounter / admission / stay */
  encounter?: Reference<'Encounter'>;
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
}

/* Base StructureDefinition for Age Type: A duration of time during which an organism (or a process) has existed. */
export type Age = Quantity;
/* An amount of money. With regard to precision, see [Decimal Precision](datatypes.html#precision) */
export type MoneyQuantity = Quantity;
/* An additional code that may be used to represent the concept. */
export interface codesystemAlternate {
  /* Code that represents the concept */
  code: code;
  /* Expected use of the code */
  use: Coding;
}

/* Identifies a sibling of the relative. */
export interface familyMemberHistoryGeneticsSibling {
  /* Link to sibling relative(s) */
  reference: Reference<'FamilyMemberHistory'>;
  /* sibling | brother | sister | etc. */
  'type':
    | 'BRO'
    | 'FTWIN'
    | 'FTWINBRO'
    | 'FTWINSIS'
    | 'HBRO'
    | 'HSIB'
    | 'HSIS'
    | 'ITWIN'
    | 'ITWINBRO'
    | 'ITWINSIS'
    | 'NBRO'
    | 'NSIB'
    | 'NSIS'
    | 'SIB'
    | 'SIS'
    | 'STPBRO'
    | 'STPSIB'
    | 'STPSIS'
    | 'TWIN'
    | 'TWINBRO'
    | 'TWINSIS';
}

/* AminoAcidChange information. */
export interface observationGeneticsAminoAcidChange {
  /* HGVS nomenclature for observed Amino Acid Change */
  Name?: 'CodeableConcept';
  /* Amino Acid Change Type */
  Type?: CodeableConcept;
}

/* Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */
export interface MedicinalProduct extends DomainResource, Resource<'MedicinalProduct'> {
  crossReference?: Identifier;
  manufacturingBusinessOperation?: {
    _effectiveDate?: Element;
    /* Regulatory authorization date */
    effectiveDate?: dateTime;
    /* A regulator which oversees the operation */
    regulator?: Reference<'Organization'>;
    /* The type of manufacturing operation */
    operationType?: CodeableConcept;
    manufacturer?: Array<Reference<'Organization'>>;
    /* To indicate if this proces is commercially confidential */
    confidentialityIndicator?: CodeableConcept;
    /* Regulatory authorization reference number */
    authorisationReferenceNumber?: Identifier;
  };
  pharmaceuticalProduct?: Array<Reference<'MedicinalProductPharmaceutical'>>;
  _specialMeasures?: Element;
  clinicalTrial?: Array<Reference<'ResearchStudy'>>;
  /* If this medicine applies to human or veterinary uses */
  domain?: Coding;
  /* Regulatory type, e.g. Investigational or Authorized */
  'type'?: CodeableConcept;
  /* The dose form for a single part product, or combined form of a multiple part product */
  combinedPharmaceuticalDoseForm?: CodeableConcept;
  attachedDocument?: Array<Reference<'DocumentReference'>>;
  contact?: Array<Reference<'PractitionerRole' | 'Organization'>>;
  identifier?: Identifier;
  /* If authorised for use in children */
  paediatricUseIndicator?: CodeableConcept;
  productClassification?: CodeableConcept;
  specialDesignation?: {
    _date?: Element;
    /* The type of special designation, e.g. orphan drug, minor use */
    'type'?: CodeableConcept;
    identifier?: Identifier;
    /* Animal species for which this applies */
    species?: CodeableConcept;
    /* For example granted, pending, expired or withdrawn */
    status?: CodeableConcept;
    /* Condition for which the medicinal use applies */
    indication?: {
      Reference?: Reference<'MedicinalProductIndication'>;
      CodeableConcept?: CodeableConcept;
    };
    /* Date when the designation was granted */
    date?: dateTime;
    /* The intended use of the product, e.g. prevention, treatment */
    intendedUse?: CodeableConcept;
  };
  /* Whether the Medicinal Product is subject to additional monitoring for regulatory reasons */
  additionalMonitoringIndicator?: CodeableConcept;
  masterFile?: Array<Reference<'DocumentReference'>>;
  name: {
    /* The full product name */
    productName: string;
    countryLanguage?: {
      /* Country code for where this name applies */
      country: CodeableConcept;
      /* Language code for this name */
      language: CodeableConcept;
      /* Jurisdiction code for where this name applies */
      jurisdiction?: CodeableConcept;
    };
    namePart?: {
      /* Idenifying type for this part of the name (e.g. strength part) */
      'type': Coding;
      _part?: Element;
      /* A fragment of a product name */
      part: string;
    };
    _productName?: Element;
  };
  /* The legal status of supply of the medicinal product as classified by the regulator */
  legalStatusOfSupply?: CodeableConcept;
  marketingStatus?: MarketingStatus;
  specialMeasures?: string;
  packagedMedicinalProduct?: Array<Reference<'MedicinalProductPackaged'>>;
}

export type RPCgetAvailableFilters = {
  method: 'relatient.elastic/get-available-filters';
  params: {
    [key: string]: any;
  };
};
export type RPCloadProviders = {
  method: 'relatient.pmsystem/load-providers';
  params: {
    account: string;
    'pm-id': string;
  };
};
/* Risk of harmful or undesirable, physiological response which is unique to an individual and associated with exposure to a substance. */
export interface AllergyIntolerance extends DomainResource, Resource<'AllergyIntolerance'> {
  /* allergy | intolerance - Underlying mechanism (if known) */
  'type'?: 'allergy' | 'intolerance';
  note?: Annotation;
  identifier?: Identifier;
  /* Who recorded the sensitivity */
  recorder?: Reference<'PractitionerRole' | 'RelatedPerson' | 'Practitioner' | 'Patient'>;
  _recordedDate?: Element;
  /* Source of the information about the allergy */
  asserter?: Reference<'Practitioner' | 'Patient' | 'PractitionerRole' | 'RelatedPerson'>;
  _category?: Element;
  _type?: Element;
  /* Code that identifies the allergy or intolerance */
  code?: CodeableConcept;
  /* Date first version of the resource instance was recorded */
  recordedDate?: dateTime;
  /* Encounter when the allergy or intolerance was asserted */
  encounter?: Reference<'Encounter'>;
  /* Who the sensitivity is for */
  patient: Reference<'Patient'>;
  category?: Array<'biologic' | 'environment' | 'food' | 'medication'>;
  /* active | inactive | resolved */
  clinicalStatus?: 'active' | 'inactive' | 'resolved';
  _criticality?: Element;
  /* Date(/time) of last known occurrence of a reaction */
  lastOccurrence?: dateTime;
  /* unconfirmed | confirmed | refuted | entered-in-error */
  verificationStatus?: 'confirmed' | 'entered-in-error' | 'refuted' | 'unconfirmed';
  _lastOccurrence?: Element;
  /* low | high | unable-to-assess */
  criticality?: 'high' | 'low' | 'unable-to-assess';
  /* When allergy or intolerance was identified */
  onset?: {
    _string?: Element;
    string?: string;
    Period?: Period;
    Range?: Range;
    _dateTime?: Element;
    dateTime?: dateTime;
    Age?: Age;
  };
  reaction?: {
    _onset?: Element;
    /* Date(/time) when manifestations showed */
    onset?: dateTime;
    note?: Annotation;
    manifestation: CodeableConcept;
    /* How the subject was exposed to the substance */
    exposureRoute?: CodeableConcept;
    /* Description of the event as a whole */
    description?: string;
    _severity?: Element;
    _description?: Element;
    /* mild | moderate | severe (of event as a whole) */
    severity?: 'mild' | 'moderate' | 'severe';
    /* Specific substance or pharmaceutical product considered to be responsible for event */
    substance?: CodeableConcept;
  };
}

/* Information captured by the author/maintainer of the questionnaire for development purposes, not intended to be seen by users. */
export type designNote = markdown;
/* Todo. */
export interface SubstanceReferenceInformation extends DomainResource, Resource<'SubstanceReferenceInformation'> {
  gene?: {
    /* Todo */
    gene?: CodeableConcept;
    /* Todo */
    geneSequenceOrigin?: CodeableConcept;
    source?: Array<Reference<'DocumentReference'>>;
  };
  /* Todo */
  comment?: string;
  _comment?: Element;
  geneElement?: {
    /* Todo */
    'type'?: CodeableConcept;
    /* Todo */
    element?: Identifier;
    source?: Array<Reference<'DocumentReference'>>;
  };
  target?: {
    /* Todo */
    organism?: CodeableConcept;
    /* Todo */
    organismType?: CodeableConcept;
    /* Todo */
    target?: Identifier;
    /* Todo */
    amountType?: CodeableConcept;
    /* Todo */
    'type'?: CodeableConcept;
    /* Todo */
    interaction?: CodeableConcept;
    /* Todo */
    amount?: {
      Quantity?: Quantity;
      _string?: Element;
      Range?: Range;
      string?: string;
    };
    source?: Array<Reference<'DocumentReference'>>;
  };
  classification?: {
    /* Todo */
    classification?: CodeableConcept;
    /* Todo */
    domain?: CodeableConcept;
    source?: Array<Reference<'DocumentReference'>>;
    subtype?: CodeableConcept;
  };
}

/* Base StructureDefinition for Expression Type: A expression that is evaluated in a specified context and returns a value. The context of use of the expression must specify the context in which the expression is evaluated, and how the result of the expression is used. */
export interface Expression extends Element {
  _description?: Element;
  /* Expression in specified language */
  expression?: string;
  _expression?: Element;
  _reference?: Element;
  /* text/cql | text/fhirpath | application/x-fhir-query | etc. */
  language: code;
  /* Natural language description of the condition */
  description?: string;
  _language?: Element;
  /* Where the expression is found */
  reference?: uri;
  /* Short name assigned to expression for reuse */
  name?: id;
  _name?: Element;
}

/* Base StructureDefinition for Money Type: An amount of economic utility in some recognized currency. */
export interface Money extends Element {
  /* ISO 4217 Currency Code */
  currency?: 'code';
  /* Numerical value (with implicit precision) */
  value?: decimal;
  _currency?: Element;
  _value?: Element;
}

/* Demographics and administrative information about a person independent of a specific health-related context. */
export interface Person extends DomainResource, Resource<'Person'> {
  _gender?: Element;
  /* This person's record is in active use */
  active?: boolean;
  /* The date on which the person was born */
  birthDate?: date;
  /* male | female | other | unknown */
  gender?: 'female' | 'male' | 'other' | 'unknown';
  name?: HumanName;
  address?: Address;
  link?: {
    _assurance?: Element;
    /* level1 | level2 | level3 | level4 */
    assurance?: 'level1' | 'level2' | 'level3' | 'level4';
    /* The resource to which this actual person is associated */
    target: Reference<'Practitioner' | 'RelatedPerson' | 'Person' | 'Patient'>;
  };
  /* The organization that is the custodian of the person record */
  managingOrganization?: Reference<'Organization'>;
  _active?: Element;
  /* Image of the person */
  photo?: Attachment;
  telecom?: ContactPoint;
  _birthDate?: Element;
  identifier?: Identifier;
}

export interface PractitionerRole extends DomainResource, Resource<'PractitionerRole'> {
  /* Organization where the roles are available */
  organization?: Reference<'Organization'>;
  _availabilityExceptions?: Element;
  endpoint?: Array<Reference<'Endpoint'>>;
  /* Description of availability exceptions */
  availabilityExceptions?: string;
  healthcareService?: Array<Reference<'HealthcareService'>>;
  /* Practitioner that is able to provide the defined services for the organization */
  practitioner?: Reference<'Practitioner'>;
  _active?: Element;
  /* The period during which the practitioner is authorized to perform in these role(s) */
  period?: Period;
  location?: Array<Reference<'Location'>>;
  availableTime?: {
    daysOfWeek?: Array<'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed'>;
    _allDay?: Element;
    _availableStartTime?: Element;
    _availableEndTime?: Element;
    /* Always available? e.g. 24 hour service */
    allDay?: boolean;
    /* Opening time of day (ignored if allDay = true) */
    availableStartTime?: time;
    _daysOfWeek?: Element;
    /* Closing time of day (ignored if allDay = true) */
    availableEndTime?: time;
  };
  specialty?: Array<CodeableConcept>;
  notAvailable?: {
    /* Service not available from this date */
    during?: Period;
    /* Reason presented to the user explaining why time not available */
    description: string;
    _description?: Element;
  };
  code?: CodeableConcept;
  telecom?: ContactPoint;
  /* Whether this practitioner role record is in active use */
  active?: boolean;
  identifier?: Identifier;
}

/* Base StructureDefinition for time Type: A time during the day, with no date specified */
export type time = string;
export interface AthenaProvider {
  [key: string]: any;
}

/* Base StructureDefinition for Contributor Type: A contributor to the content of a knowledge asset, including authors, editors, reviewers, and endorsers. */
export interface Contributor extends Element {
  _type?: Element;
  /* author | editor | reviewer | endorser */
  'type': 'author' | 'editor' | 'endorser' | 'reviewer';
  contact?: ContactDetail;
  _name?: Element;
  /* Who contributed the content */
  name: string;
}

/* Significant health conditions for a person related to the patient relevant in the context of care for the patient. */
export interface FamilyMemberHistory extends DomainResource, Resource<'FamilyMemberHistory'> {
  note?: Annotation;
  /* Relationship to the subject */
  relationship: CodeableConcept;
  reasonReference?: Array<
    Reference<
      | 'DiagnosticReport'
      | 'Condition'
      | 'AllergyIntolerance'
      | 'QuestionnaireResponse'
      | 'Observation'
      | 'DocumentReference'
    >
  >;
  _name?: Element;
  /* When history was recorded or last updated */
  date?: dateTime;
  _status?: Element;
  instantiatesCanonical?: canonical;
  /* (approximate) date of birth */
  born?: {
    date?: date;
    _string?: Element;
    string?: string;
    Period?: Period;
    _date?: Element;
  };
  identifier?: Identifier;
  /* Patient history is about */
  patient: Reference<'Patient'>;
  _date?: Element;
  _instantiatesUri?: Element;
  instantiatesUri?: uri;
  _estimatedAge?: Element;
  condition?: {
    /* deceased | permanent disability | etc. */
    outcome?: CodeableConcept;
    /* Condition suffered by relation */
    code: CodeableConcept;
    /* Whether the condition contributed to the cause of death */
    contributedToDeath?: boolean;
    _contributedToDeath?: Element;
    /* When condition first manifested */
    onset?: {
      Period?: Period;
      Range?: Range;
      Age?: Age;
      string?: string;
      _string?: Element;
    };
    note?: Annotation;
  };
  /* subject-unknown | withheld | unable-to-obtain | deferred */
  dataAbsentReason?: CodeableConcept;
  /* (approximate) age */
  age?: {
    _string?: Element;
    Age?: Age;
    string?: string;
    Range?: Range;
  };
  _instantiatesCanonical?: Element;
  /* Age is estimated? */
  estimatedAge?: boolean;
  /* The family member described */
  name?: string;
  /* male | female | other | unknown */
  sex?: CodeableConcept;
  reasonCode?: CodeableConcept;
  /* partial | completed | entered-in-error | health-unknown */
  status: 'completed' | 'entered-in-error' | 'health-unknown' | 'partial';
  /* Dead? How old/when? */
  deceased?: {
    Range?: Range;
    _date?: Element;
    _string?: Element;
    string?: string;
    boolean?: boolean;
    date?: date;
    _boolean?: Element;
    Age?: Age;
  };
}

/* The technical details of an endpoint that can be used for electronic services, such as for web services providing XDS.b or a REST endpoint for another FHIR server. This may include any security context information. */
export interface Endpoint extends DomainResource, Resource<'Endpoint'> {
  header?: string;
  payloadType: CodeableConcept;
  contact?: ContactPoint;
  /* Organization that manages this endpoint (might not be the organization that exposes the endpoint) */
  managingOrganization?: Reference<'Organization'>;
  _header?: Element;
  /* Interval the endpoint is expected to be operational */
  period?: Period;
  payloadMimeType?: Array<'application/hl7-cda+xml'>;
  _name?: Element;
  _payloadMimeType?: Element;
  _status?: Element;
  identifier?: Identifier;
  /* The technical base address for connecting to this endpoint */
  address: url;
  _address?: Element;
  /* Protocol/Profile/Standard to be used with this endpoint connection */
  connectionType: Coding;
  /* active | suspended | error | off | entered-in-error | test */
  status: 'active' | 'entered-in-error' | 'error' | 'off' | 'suspended' | 'test';
  /* A name that this endpoint can be identified by */
  name?: string;
}

/* Identifies a parent of the relative. */
export interface familyMemberHistoryGeneticsParent {
  /* Link to parent relative(s) */
  reference: Reference<'FamilyMemberHistory'>;
  /* mother | father | adoptive mother | etc. */
  'type':
    | 'ADOPTF'
    | 'ADOPTM'
    | 'ADOPTP'
    | 'FTH'
    | 'FTHFOST'
    | 'FTWIN'
    | 'GESTM'
    | 'ITWIN'
    | 'MTH'
    | 'MTHFOST'
    | 'NFTH'
    | 'NFTHF'
    | 'NMTH'
    | 'NMTHF'
    | 'NPRN'
    | 'PRN'
    | 'PRNFOST'
    | 'STPFTH'
    | 'STPMTH'
    | 'STPPRN'
    | 'TWIN';
}

export type RPCsearchAppointmentTypes = {
  method: 'relatient.pmsystem/search-appointment-types';
  params: {
    search?: string;
    account: string;
    'pm-id': string;
  };
};
/* A definition of a FHIR structure. This resource is used to describe the underlying resources, data types defined in FHIR, and also for describing extensions and constraints on resources and data types. */
export interface StructureDefinition extends DomainResource, Resource<'StructureDefinition'> {
  _type?: Element;
  jurisdiction?: CodeableConcept;
  _kind?: Element;
  _version?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* specialization | constraint - How relates to base definition */
  derivation?: 'constraint' | 'specialization';
  _baseDefinition?: Element;
  _experimental?: Element;
  _title?: Element;
  contact?: ContactDetail;
  _abstract?: Element;
  _publisher?: Element;
  contextInvariant?: string;
  /* Whether the structure is abstract */
  abstract: boolean;
  _date?: Element;
  /* FHIR Version this StructureDefinition targets */
  fhirVersion?:
    | '0.01'
    | '0.05'
    | '0.06'
    | '0.0.80'
    | '0.0.81'
    | '0.0.82'
    | '0.11'
    | '0.4.0'
    | '0.5.0'
    | '1.0.0'
    | '1.0.1'
    | '1.0.2'
    | '1.1.0'
    | '1.4.0'
    | '1.6.0'
    | '1.8.0'
    | '3.0.0'
    | '3.0.1'
    | '3.3.0'
    | '3.5.0'
    | '4.0.0'
    | '4.0.1';
  _copyright?: Element;
  _status?: Element;
  keyword?: Coding;
  _derivation?: Element;
  identifier?: Identifier;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* Why this structure definition is defined */
  purpose?: markdown;
  _url?: Element;
  /* Snapshot view of the structure */
  snapshot?: {
    element: ElementDefinition;
  };
  _contextInvariant?: Element;
  mapping?: {
    _comment?: Element;
    _identity?: Element;
    _name?: Element;
    /* Versions, Issues, Scope limitations etc. */
    comment?: string;
    /* Names what this mapping refers to */
    name?: string;
    _uri?: Element;
    /* Internal id when this mapping is used */
    identity: id;
    /* Identifies what this mapping refers to */
    uri?: uri;
  };
  /* Business version of the structure definition */
  version?: string;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Name for this structure definition (computer friendly) */
  name: string;
  /* Natural language description of the structure definition */
  description?: markdown;
  _fhirVersion?: Element;
  _purpose?: Element;
  /* primitive-type | complex-type | resource | logical */
  kind: 'complex-type' | 'logical' | 'primitive-type' | 'resource';
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Date last changed */
  date?: dateTime;
  _name?: Element;
  /* Name for this structure definition (human friendly) */
  title?: string;
  /* Definition that this type is constrained/specialized from */
  baseDefinition?: canonical;
  context?: {
    _type?: Element;
    /* Where the extension can be used in instances */
    expression: string;
    /* fhirpath | element | extension */
    'type': 'element' | 'extension' | 'fhirpath';
    _expression?: Element;
  };
  useContext?: UsageContext;
  _description?: Element;
  /* Differential view of the structure */
  differential?: {
    element: ElementDefinition;
  };
  /* Canonical identifier for this structure definition, represented as a URI (globally unique) */
  url: uri;
  /* Type defined or constrained by this structure */
  'type': uri;
}

export type RPClookup = {
  method: 'relatient.prototype.questionnaire/lookup';
  params: {
    [key: string]: any;
  };
};
/* This resource provides the insurance enrollment details to the insurer regarding a specified coverage. */
export interface EnrollmentRequest extends DomainResource, Resource<'EnrollmentRequest'> {
  /* Responsible practitioner */
  provider?: Reference<'Practitioner' | 'Organization' | 'PractitionerRole'>;
  identifier?: Identifier;
  /* Creation date */
  created?: dateTime;
  _created?: Element;
  /* active | cancelled | draft | entered-in-error */
  status?: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  /* The subject to be enrolled */
  candidate?: Reference<'Patient'>;
  /* Target */
  insurer?: Reference<'Organization'>;
  _status?: Element;
  /* Insurance information */
  coverage?: Reference<'Coverage'>;
}

/* Represents a request for a patient to employ a medical device. The device may be an implantable device, or an external assistive device, such as a walker. */
export interface DeviceRequest extends DomainResource, Resource<'DeviceRequest'> {
  _intent?: Element;
  _priority?: Element;
  instantiatesCanonical?: canonical;
  priorRequest?: Array<Reference<'Reference'>>;
  basedOn?: Array<Reference<'Reference'>>;
  _status?: Element;
  relevantHistory?: Array<Reference<'Provenance'>>;
  instantiatesUri?: uri;
  reasonCode?: CodeableConcept;
  /* Requested Filler */
  performer?: Reference<
    | 'Practitioner'
    | 'Device'
    | 'HealthcareService'
    | 'PractitionerRole'
    | 'Patient'
    | 'Organization'
    | 'CareTeam'
    | 'RelatedPerson'
  >;
  _instantiatesCanonical?: Element;
  /* Device requested */
  code?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Device'>;
  };
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  /* Encounter motivating request */
  encounter?: Reference<'Encounter'>;
  /* proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option */
  intent:
    | 'directive'
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order';
  /* Desired time or schedule for use */
  occurrence?: {
    Period?: Period;
    dateTime?: dateTime;
    Timing?: Timing;
    _dateTime?: Element;
  };
  _authoredOn?: Element;
  parameter?: {
    /* Device detail */
    code?: CodeableConcept;
    /* Value of detail */
    value?: {
      Quantity?: Quantity;
      boolean?: boolean;
      CodeableConcept?: CodeableConcept;
      Range?: Range;
      _boolean?: Element;
    };
  };
  supportingInfo?: Array<Reference<'Reference'>>;
  insurance?: Array<Reference<'ClaimResponse' | 'Coverage'>>;
  _instantiatesUri?: Element;
  /* draft | active | on-hold | revoked | completed | entered-in-error | unknown */
  status?: 'active' | 'completed' | 'draft' | 'entered-in-error' | 'on-hold' | 'revoked' | 'unknown';
  /* Focus of request */
  subject: Reference<'Group' | 'Device' | 'Patient' | 'Location'>;
  reasonReference?: Array<Reference<'DocumentReference' | 'Observation' | 'DiagnosticReport' | 'Condition'>>;
  /* Filler role */
  performerType?: CodeableConcept;
  note?: Annotation;
  /* When recorded */
  authoredOn?: dateTime;
  /* Identifier of composite request */
  groupIdentifier?: Identifier;
  /* Who/what is requesting diagnostics */
  requester?: Reference<'Organization' | 'PractitionerRole' | 'Device' | 'Practitioner'>;
  identifier?: Identifier;
}

/* This extension declares a group of concepts that is generated into the ValueSet.expansion.contains hierarchy when the expansion is generated for a UI. THere is no inherent assigned meaning to the hierarchy; it is used to help the user navigate the concepts. Each group has a display and/or a code, and a list of members, which are either concepts in the value set, or other groups (by code). */
export interface valuesetExpandGroup {
  member: code;
  /* Underlying code from the system */
  code?: code;
  /* Display for the group */
  display?: string;
}

/* Describes the intention of how one or more practitioners intend to deliver care for a particular patient, group or community for a period of time, possibly limited to care for a specific condition or set of conditions. */
export interface CarePlan extends DomainResource, Resource<'CarePlan'> {
  /* Time period plan covers */
  period?: Period;
  _description?: Element;
  _status?: Element;
  identifier?: Identifier;
  note?: Annotation;
  /* Date record was first recorded */
  created?: dateTime;
  goal?: Array<Reference<'Goal'>>;
  _title?: Element;
  _intent?: Element;
  /* Who is the designated responsible party */
  author?: Reference<
    'RelatedPerson' | 'CareTeam' | 'Patient' | 'Device' | 'Practitioner' | 'PractitionerRole' | 'Organization'
  >;
  instantiatesCanonical?: canonical;
  basedOn?: Array<Reference<'CarePlan'>>;
  instantiatesUri?: uri;
  /* Human-friendly name for the care plan */
  title?: string;
  /* proposal | plan | order | option */
  intent: 'option' | 'order' | 'plan' | 'proposal';
  /* Summary of nature of plan */
  description?: string;
  replaces?: Array<Reference<'CarePlan'>>;
  category?: CodeableConcept;
  contributor?: Array<
    Reference<
      'Patient' | 'Organization' | 'Device' | 'RelatedPerson' | 'Practitioner' | 'CareTeam' | 'PractitionerRole'
    >
  >;
  /* Who the care plan is for */
  subject: Reference<'Group' | 'Patient'>;
  _instantiatesUri?: Element;
  _created?: Element;
  partOf?: Array<Reference<'CarePlan'>>;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* draft | active | on-hold | revoked | completed | entered-in-error | unknown */
  status: 'active' | 'completed' | 'draft' | 'entered-in-error' | 'on-hold' | 'revoked' | 'unknown';
  supportingInfo?: Array<Reference<'Reference'>>;
  careTeam?: Array<Reference<'CareTeam'>>;
  activity?: {
    outcomeReference?: Array<Reference<'Reference'>>;
    /* Activity details defined in specific resource */
    reference?: Reference<
      | 'RequestGroup'
      | 'DeviceRequest'
      | 'VisionPrescription'
      | 'Appointment'
      | 'CommunicationRequest'
      | 'Task'
      | 'ServiceRequest'
      | 'NutritionOrder'
      | 'MedicationRequest'
    >;
    /* In-line definition of activity */
    detail?: {
      /* What is to be administered/supplied */
      product?: {
        CodeableConcept?: CodeableConcept;
        Reference?: Reference<'Substance' | 'Medication'>;
      };
      _instantiatesUri?: Element;
      /* Detail type of activity */
      code?: CodeableConcept;
      /* not-started | scheduled | in-progress | on-hold | completed | cancelled | stopped | unknown | entered-in-error */
      status:
        | 'cancelled'
        | 'completed'
        | 'entered-in-error'
        | 'in-progress'
        | 'not-started'
        | 'on-hold'
        | 'scheduled'
        | 'stopped'
        | 'unknown';
      _kind?: Element;
      /* How much to administer/supply/consume */
      quantity?: Quantity;
      instantiatesUri?: uri;
      reasonCode?: CodeableConcept;
      reasonReference?: Array<Reference<'Condition' | 'DiagnosticReport' | 'Observation' | 'DocumentReference'>>;
      /* When activity is to occur */
      scheduled?: {
        _string?: Element;
        Timing?: Timing;
        Period?: Period;
        string?: string;
      };
      /* Where it should happen */
      location?: Reference<'Location'>;
      _doNotPerform?: Element;
      goal?: Array<Reference<'Goal'>>;
      performer?: Array<
        Reference<
          | 'PractitionerRole'
          | 'HealthcareService'
          | 'Organization'
          | 'Practitioner'
          | 'CareTeam'
          | 'Device'
          | 'Patient'
          | 'RelatedPerson'
        >
      >;
      /* If true, activity is prohibiting action */
      doNotPerform?: boolean;
      /* Reason for current status */
      statusReason?: CodeableConcept;
      _instantiatesCanonical?: Element;
      _description?: Element;
      _status?: Element;
      /* Appointment | CommunicationRequest | DeviceRequest | MedicationRequest | NutritionOrder | Task | ServiceRequest | VisionPrescription */
      kind?:
        | 'Appointment'
        | 'CommunicationRequest'
        | 'DeviceRequest'
        | 'MedicationRequest'
        | 'NutritionOrder'
        | 'ServiceRequest'
        | 'Task'
        | 'VisionPrescription';
      /* Extra info describing activity to perform */
      description?: string;
      instantiatesCanonical?: canonical;
      /* How to consume/day? */
      dailyAmount?: Quantity;
    };
    outcomeCodeableConcept?: CodeableConcept;
    progress?: Annotation;
  };
  addresses?: Array<Reference<'Condition'>>;
  _instantiatesCanonical?: Element;
}

/* A task to be performed. */
export interface Task extends DomainResource, Resource<'Task'> {
  insurance?: Array<Reference<'Coverage' | 'ClaimResponse'>>;
  output?: {
    /* Label for output */
    'type': CodeableConcept;
    /* Result of output */
    value?: {
      ParameterDefinition?: ParameterDefinition;
      RelatedArtifact?: RelatedArtifact;
      Distance?: Distance;
      ContactPoint?: ContactPoint;
      Quantity?: Quantity;
      Reference?: Reference<'Reference'>;
      _url?: Element;
      _uuid?: Element;
      _string?: Element;
      oid?: oid;
      positiveInt?: positiveInt;
      uuid?: uuid;
      Period?: Period;
      Duration?: Duration;
      _uri?: Element;
      DataRequirement?: DataRequirement;
      _code?: Element;
      Money?: Money;
      Timing?: Timing;
      _decimal?: Element;
      Contributor?: Contributor;
      markdown?: markdown;
      Address?: Address;
      Age?: Age;
      HumanName?: HumanName;
      _id?: Element;
      time?: time;
      Ratio?: Ratio;
      Attachment?: Attachment;
      Count?: Count;
      CodeableConcept?: CodeableConcept;
      decimal?: decimal;
      Dosage?: Dosage;
      base64Binary?: base64Binary;
      TriggerDefinition?: TriggerDefinition;
      Coding?: Coding;
      Expression?: Expression;
      Range?: Range;
      _boolean?: Element;
      code?: code;
      id?: id;
      _time?: Element;
      url?: url;
      _instant?: Element;
      _integer?: Element;
      uri?: uri;
      Signature?: Signature;
      unsignedInt?: unsignedInt;
      dateTime?: dateTime;
      date?: date;
      _base64Binary?: Element;
      Annotation?: Annotation;
      _unsignedInt?: Element;
      SampledData?: SampledData;
      _canonical?: Element;
      _dateTime?: Element;
      _date?: Element;
      boolean?: boolean;
      string?: string;
      canonical?: canonical;
      Meta?: Meta;
      ContactDetail?: ContactDetail;
      _oid?: Element;
      _markdown?: Element;
      integer?: integer;
      Identifier?: Identifier;
      UsageContext?: UsageContext;
      instant?: instant;
      _positiveInt?: Element;
    };
  };
  note?: Annotation;
  /* Start and end time of execution */
  executionPeriod?: Period;
  _instantiatesCanonical?: Element;
  _authoredOn?: Element;
  identifier?: Identifier;
  input?: {
    /* Label for the input */
    'type': CodeableConcept;
    /* Content to use in performing the task */
    value?: {
      date?: date;
      markdown?: markdown;
      _canonical?: Element;
      unsignedInt?: unsignedInt;
      time?: time;
      _id?: Element;
      Reference?: Reference<'Reference'>;
      Attachment?: Attachment;
      ContactDetail?: ContactDetail;
      SampledData?: SampledData;
      string?: string;
      Signature?: Signature;
      positiveInt?: positiveInt;
      code?: code;
      integer?: integer;
      Ratio?: Ratio;
      _time?: Element;
      _uuid?: Element;
      Annotation?: Annotation;
      _instant?: Element;
      uri?: uri;
      Duration?: Duration;
      boolean?: boolean;
      instant?: instant;
      Dosage?: Dosage;
      UsageContext?: UsageContext;
      _url?: Element;
      Range?: Range;
      id?: id;
      _decimal?: Element;
      decimal?: decimal;
      Identifier?: Identifier;
      TriggerDefinition?: TriggerDefinition;
      Meta?: Meta;
      Period?: Period;
      _date?: Element;
      uuid?: uuid;
      DataRequirement?: DataRequirement;
      _integer?: Element;
      _code?: Element;
      dateTime?: dateTime;
      Money?: Money;
      RelatedArtifact?: RelatedArtifact;
      _uri?: Element;
      ContactPoint?: ContactPoint;
      Coding?: Coding;
      _string?: Element;
      ParameterDefinition?: ParameterDefinition;
      _boolean?: Element;
      _oid?: Element;
      Address?: Address;
      _base64Binary?: Element;
      base64Binary?: base64Binary;
      _unsignedInt?: Element;
      Timing?: Timing;
      Expression?: Expression;
      Quantity?: Quantity;
      Count?: Count;
      _dateTime?: Element;
      CodeableConcept?: CodeableConcept;
      HumanName?: HumanName;
      oid?: oid;
      _markdown?: Element;
      Distance?: Distance;
      Age?: Age;
      canonical?: canonical;
      url?: url;
      Contributor?: Contributor;
      _positiveInt?: Element;
    };
  };
  /* Formal definition of task */
  instantiatesUri?: uri;
  /* unknown | proposal | plan | order | original-order | reflex-order | filler-order | instance-order | option */
  intent:
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order'
    | 'unknown';
  /* Why task is needed */
  reasonReference?: Reference<'Reference'>;
  performerType?: Array<CodeableConcept>;
  _description?: Element;
  /* Task Creation Date */
  authoredOn?: dateTime;
  /* Task Type */
  code?: CodeableConcept;
  /* Formal definition of task */
  instantiatesCanonical?: canonical;
  /* E.g. "Specimen collected", "IV prepped" */
  businessStatus?: CodeableConcept;
  /* Beneficiary of the Task */
  for?: Reference<'Reference'>;
  /* What task is acting on */
  focus?: Reference<'Reference'>;
  /* Healthcare event during which this task originated */
  encounter?: Reference<'Encounter'>;
  /* Who is asking for task to be done */
  requester?: Reference<'PractitionerRole' | 'Patient' | 'Organization' | 'Device' | 'RelatedPerson' | 'Practitioner'>;
  _status?: Element;
  basedOn?: Array<Reference<'Reference'>>;
  /* Human-readable explanation of task */
  description?: string;
  /* Task Last Modified Date */
  lastModified?: dateTime;
  _lastModified?: Element;
  partOf?: Array<Reference<'Task'>>;
  _instantiatesUri?: Element;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  _intent?: Element;
  /* Where task occurs */
  location?: Reference<'Location'>;
  relevantHistory?: Array<Reference<'Provenance'>>;
  /* Constraints on fulfillment tasks */
  restriction?: {
    /* When fulfillment sought */
    period?: Period;
    _repetitions?: Element;
    /* How many times to repeat */
    repetitions?: positiveInt;
    recipient?: Array<
      Reference<'RelatedPerson' | 'PractitionerRole' | 'Group' | 'Practitioner' | 'Organization' | 'Patient'>
    >;
  };
  /* draft | requested | received | accepted | + */
  status:
    | 'accepted'
    | 'cancelled'
    | 'completed'
    | 'draft'
    | 'entered-in-error'
    | 'failed'
    | 'in-progress'
    | 'on-hold'
    | 'ready'
    | 'received'
    | 'rejected'
    | 'requested';
  /* Reason for current status */
  statusReason?: CodeableConcept;
  /* Requisition or grouper id */
  groupIdentifier?: Identifier;
  _priority?: Element;
  /* Why task is needed */
  reasonCode?: CodeableConcept;
  /* Responsible individual */
  owner?: Reference<
    | 'Device'
    | 'RelatedPerson'
    | 'CareTeam'
    | 'Practitioner'
    | 'PractitionerRole'
    | 'HealthcareService'
    | 'Organization'
    | 'Patient'
  >;
}

export type RPCgetOrganizations = {
  method: 'relatient.self-scheduling/get-organizations';
  params: {
    [key: string]: any;
  };
};
export type RPCinitEsIndex = {
  method: 'relatient.processing/init-es-index';
  params: {
    [key: string]: any;
  };
};
/* The inclusive upper bound on the range of allowed values for the data element. */
export interface maxValue {
  integer?: integer;
  dateTime?: dateTime;
  time?: time;
  date?: date;
  decimal?: decimal;
  instant?: instant;
}

/* Resource contained all event logs for campaign */
export interface EventLog extends Resource<'EventLog'> {
  data?: any;
  entity?: Array<Reference<'Appointment' | 'PlanDefinition' | 'Broadcast' | 'Recall' | 'Organization'>>;
  'type': string;
  campaign?: Reference<'Campaign'>;
  event: string;
  patient?: Reference<'Patient'>;
  systemAccount?: Reference<'SystemAccount'>;
  recorded: dateTime;
}

export interface FeatureBinding extends Resource<'FeatureBinding'> {
  permission: Reference<'Permission'>;
  role: Reference<'Role'>;
}

export type RPCesQuery = {
  method: 'relatient.processing/es-query';
  params: {
    [key: string]: any;
  };
};
export type RPCgetUiConfiguration = {
  method: 'relatient.self-scheduling/get-ui-configuration';
  params: {
    account: string;
  };
};
/* Record details about an anatomical structure.  This resource may be used when a coded concept does not provide the necessary detail needed for the use case. */
export interface BodyStructure extends DomainResource, Resource<'BodyStructure'> {
  identifier?: Identifier;
  /* Body site */
  location?: CodeableConcept;
  _description?: Element;
  _active?: Element;
  locationQualifier?: CodeableConcept;
  /* Text description */
  description?: string;
  image?: Attachment;
  /* Kind of Structure */
  morphology?: CodeableConcept;
  /* Whether this record is in active use */
  active?: boolean;
  /* Who this is about */
  patient: Reference<'Patient'>;
}

/* Base StructureDefinition for integer Type: A whole number */
export type integer = number;
export interface FeaturesConfig extends Resource<'FeaturesConfig'> {
  [key: string]: any;
}

/* haploid. */
export interface hlaGenotypingResultsHaploid {
  /* haploid-method */
  method?: CodeableConcept;
  /* haploid-type */
  'type'?: CodeableConcept;
  /* haploid-locus */
  locus?: CodeableConcept;
}

/* The ResearchDefinition resource describes the conditional state (population and any exposures being compared within the population) and outcome (if specified) that the knowledge (evidence, assertion, recommendation) is about. */
export interface ResearchDefinition extends DomainResource, Resource<'ResearchDefinition'> {
  _comment?: Element;
  _date?: Element;
  _publisher?: Element;
  _subtitle?: Element;
  _version?: Element;
  /* When the research definition was approved by publisher */
  approvalDate?: date;
  /* Name for this research definition (computer friendly) */
  name?: string;
  author?: ContactDetail;
  _lastReviewDate?: Element;
  /* What outcome? */
  outcome?: Reference<'ResearchElementDefinition'>;
  relatedArtifact?: RelatedArtifact;
  /* What exposure? */
  exposure?: Reference<'ResearchElementDefinition'>;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  identifier?: Identifier;
  _usage?: Element;
  contact?: ContactDetail;
  _purpose?: Element;
  /* Natural language description of the research definition */
  description?: markdown;
  editor?: ContactDetail;
  endorser?: ContactDetail;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  jurisdiction?: CodeableConcept;
  /* Date last changed */
  date?: dateTime;
  /* What population? */
  population: Reference<'ResearchElementDefinition'>;
  _copyright?: Element;
  _description?: Element;
  _url?: Element;
  library?: canonical;
  _experimental?: Element;
  _name?: Element;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
  subject?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Group'>;
  };
  topic?: CodeableConcept;
  useContext?: UsageContext;
  _library?: Element;
  _title?: Element;
  /* When the research definition is expected to be used */
  effectivePeriod?: Period;
  /* What alternative exposure state? */
  exposureAlternative?: Reference<'ResearchElementDefinition'>;
  comment?: string;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Subordinate title of the ResearchDefinition */
  subtitle?: string;
  _shortTitle?: Element;
  _approvalDate?: Element;
  /* Name for this research definition (human friendly) */
  title?: string;
  /* Canonical identifier for this research definition, represented as a URI (globally unique) */
  url?: uri;
  reviewer?: ContactDetail;
  /* Business version of the research definition */
  version?: string;
  /* Title for use in informal contexts */
  shortTitle?: string;
  /* Describes the clinical usage of the ResearchDefinition */
  usage?: string;
  _status?: Element;
  /* When the research definition was last reviewed */
  lastReviewDate?: date;
  /* Why this research definition is defined */
  purpose?: markdown;
}

/* Base StructureDefinition for unsignedInt type: An integer with a value that is not negative (e.g. >= 0) */
export type unsignedInt = number;
/* The approximate date, age, or flag indicating that the condition of the family member resolved. The abatement should only be specified if the condition is stated in the positive sense, i.e., the didNotHave flag is false. */
export interface familymemberhistoryAbatement {
  date?: date;
  Age?: Age;
  boolean?: boolean;
}

/* Further conditions, problems, diagnoses, procedures or events or the substance that caused/triggered this Condition. */
export interface conditionDueTo {
  CodeableConcept?: CodeableConcept;
  Reference?: Reference<
    'MedicationAdministration' | 'Procedure' | 'Condition' | 'MedicationStatement' | 'Immunization'
  >;
}

export type RPCuploadData = {
  method: 'radix.integration/upload-data';
  params: {
    [key: string]: any;
  };
};
/* The absolute geographic location of the Location, expressed using the WGS84 datum (This is the same co-ordinate system used in KML). */
export interface geolocation {
  /* Latitude with WGS84 datum */
  latitude: decimal;
  /* Longitude with WGS84 datum */
  longitude: decimal;
}

/* A structured set of questions and their answers. The questions are ordered and grouped into coherent subsets, corresponding to the structure of the grouping of the questionnaire being responded to. */
export interface QuestionnaireResponse extends DomainResource, Resource<'QuestionnaireResponse'> {
  _status?: Element;
  _questionnaire?: Element;
  basedOn?: Array<Reference<'ServiceRequest' | 'CarePlan'>>;
  /* The person who answered the questions */
  source?: Reference<'Patient' | 'RelatedPerson' | 'PractitionerRole' | 'Practitioner'>;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* Person who received and recorded the answers */
  author?: Reference<'PractitionerRole' | 'Organization' | 'Device' | 'RelatedPerson' | 'Practitioner' | 'Patient'>;
  /* Unique id for this set of answers */
  identifier?: Identifier;
  item?: {
    answer?: {
      /* Single-valued answer to the question */
      value?: {
        _boolean?: Element;
        _time?: Element;
        date?: date;
        _integer?: Element;
        decimal?: decimal;
        integer?: integer;
        _decimal?: Element;
        Quantity?: Quantity;
        boolean?: boolean;
        Attachment?: Attachment;
        _dateTime?: Element;
        _date?: Element;
        Reference?: Reference<'Reference'>;
        time?: time;
        Coding?: Coding;
        dateTime?: dateTime;
        string?: string;
        uri?: uri;
        _uri?: Element;
        _string?: Element;
      };
      item?: any;
    };
    /* Name for group or question text */
    text?: string;
    /* ElementDefinition - details for the item */
    definition?: uri;
    _text?: Element;
    item?: any;
    /* Pointer to specific item from Questionnaire */
    linkId: string;
    _linkId?: Element;
    _definition?: Element;
  };
  /* Form being answered */
  questionnaire?: canonical;
  /* in-progress | completed | amended | entered-in-error | stopped */
  status: 'amended' | 'completed' | 'entered-in-error' | 'in-progress' | 'stopped';
  /* The subject of the questions */
  subject?: Reference<'Reference'>;
  partOf?: Array<Reference<'Observation' | 'Procedure'>>;
  _authored?: Element;
  /* Date the answers were gathered */
  authored?: dateTime;
}

/* Identifies the units of measure in which the element should be captured or expressed. */
export interface elementdefinitionAllowedUnits {
  canonical?: canonical;
  CodeableConcept?: CodeableConcept;
}

/* The target of the extension is a distinct actor from the requester and has decision-making authority over the service and takes direct responsibility to manage the service. */
export interface procedureDirectedBy {
  Reference?: Reference<'Patient' | 'Practitioner' | 'PractitionerRole' | 'RelatedPerson'>;
  CodeableConcept?: CodeableConcept;
}

export interface Campaign extends Resource<'Campaign'> {
  patient: Reference<'Patient'>;
  voiceRetryIndex?: number;
  organization: Reference<'Organization'>;
  completedAt?: dateTime;
  name: string;
  status?: 'received' | 'in-progress' | 'completed' | 'cancelled' | 'failed' | 'skipped' | 'timed-out';
  campaignDef?: Reference<'PlanDefinition'>;
  conductorWorkflowId?: string;
  systemAccount: Reference<'SystemAccount'>;
  relatedResource?: Reference<'Broadcast' | 'Recall' | 'Appointment'>;
}

/* The clinical particulars - indications, contraindications etc. of a medicinal product, including for regulatory purposes. */
export interface MedicinalProductContraindication extends DomainResource, Resource<'MedicinalProductContraindication'> {
  /* The disease, symptom or procedure for the contraindication */
  disease?: CodeableConcept;
  subject?: Array<Reference<'Medication' | 'MedicinalProduct'>>;
  comorbidity?: CodeableConcept;
  /* The status of the disease or symptom for the contraindication */
  diseaseStatus?: CodeableConcept;
  population?: Population;
  therapeuticIndication?: Array<Reference<'MedicinalProductIndication'>>;
  otherTherapy?: {
    /* The type of relationship between the medicinal product indication or contraindication and another therapy */
    therapyRelationshipType: CodeableConcept;
    /* Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication */
    medication?: {
      Reference?: Reference<'SubstanceSpecification' | 'Substance' | 'Medication' | 'MedicinalProduct'>;
      CodeableConcept?: CodeableConcept;
    };
  };
}

/* A reference to a document of any kind for any purpose. Provides metadata about the document so that the document can be discovered and managed. The scope of a document is any seralized object with a mime-type, so includes formal patient centric documents (CDA), cliical notes, scanned paper, and non-patient specific documents like policy text. */
export interface DocumentReference extends DomainResource, Resource<'DocumentReference'> {
  _description?: Element;
  /* preliminary | final | amended | entered-in-error */
  docStatus?: 'amended' | 'entered-in-error' | 'final' | 'preliminary';
  /* current | superseded | entered-in-error */
  status: 'current' | 'entered-in-error' | 'superseded';
  _date?: Element;
  /* Who/what is the subject of the document */
  subject?: Reference<'Practitioner' | 'Group' | 'Device' | 'Patient'>;
  /* Human-readable description */
  description?: string;
  relatesTo?: {
    _code?: Element;
    /* Target of the relationship */
    target: Reference<'DocumentReference'>;
    /* replaces | transforms | signs | appends */
    code: 'appends' | 'replaces' | 'signs' | 'transforms';
  };
  _status?: Element;
  /* When this document reference was created */
  date?: instant;
  identifier?: Identifier;
  /* Clinical context of document */
  context?: {
    related?: Array<Reference<'Reference'>>;
    /* Patient demographics from source */
    sourcePatientInfo?: Reference<'Patient'>;
    event?: CodeableConcept;
    /* Time of service that is being documented */
    period?: Period;
    /* Kind of facility where patient was seen */
    facilityType?: CodeableConcept;
    encounter?: Array<Reference<'Encounter' | 'EpisodeOfCare'>>;
    /* Additional details about where the content was created (e.g. clinical specialty) */
    practiceSetting?: CodeableConcept;
  };
  _docStatus?: Element;
  /* Who/what authenticated the document */
  authenticator?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* Kind of document (LOINC if possible) */
  'type'?:
    | '11206-0'
    | '11485-0'
    | '11486-8'
    | '11488-4'
    | '11490-0'
    | '11492-6'
    | '11494-2'
    | '11495-9'
    | '11496-7'
    | '11497-5'
    | '11498-3'
    | '11500-6'
    | '11502-2'
    | '11503-0'
    | '11504-8'
    | '11505-5'
    | '11506-3'
    | '11507-1'
    | '11508-9'
    | '11509-7'
    | '11510-5'
    | '11512-1'
    | '11514-7'
    | '11515-4'
    | '11516-2'
    | '11517-0'
    | '11518-8'
    | '11519-6'
    | '11520-4'
    | '11521-2'
    | '11523-8'
    | '11524-6'
    | '11525-3'
    | '11526-1'
    | '11527-9'
    | '11529-5'
    | '11534-5'
    | '11536-0'
    | '11541-0'
    | '11543-6'
    | '13480-9'
    | '15507-7'
    | '15508-5'
    | '16110-9'
    | '16294-1'
    | '1656-8'
    | '17787-3'
    | '18594-2'
    | '18733-6'
    | '18734-4'
    | '18735-1'
    | '18736-9'
    | '18737-7'
    | '18738-5'
    | '18739-3'
    | '18740-1'
    | '18742-7'
    | '18743-5'
    | '18744-3'
    | '18745-0'
    | '18746-8'
    | '18748-4'
    | '18749-2'
    | '18750-0'
    | '18751-8'
    | '18752-6'
    | '18753-4'
    | '18754-2'
    | '18756-7'
    | '18759-1'
    | '18761-7'
    | '18763-3'
    | '18823-5'
    | '18824-3'
    | '18825-0'
    | '18826-8'
    | '18836-7'
    | '18841-7'
    | '18842-5'
    | '19002-5'
    | '19003-3'
    | '19004-1'
    | '21862-8'
    | '24531-6'
    | '24532-4'
    | '24533-2'
    | '24534-0'
    | '24535-7'
    | '24536-5'
    | '24537-3'
    | '24538-1'
    | '24539-9'
    | '24540-7'
    | '24541-5'
    | '24542-3'
    | '24543-1'
    | '24544-9'
    | '24545-6'
    | '24546-4'
    | '24547-2';
  /* Master Version Specific Identifier */
  masterIdentifier?: Identifier;
  securityLabel?: CodeableConcept;
  author?: Array<
    Reference<'Patient' | 'PractitionerRole' | 'Device' | 'Practitioner' | 'Organization' | 'RelatedPerson'>
  >;
  category?: CodeableConcept;
  /* Organization which maintains the document */
  custodian?: Reference<'Organization'>;
  content: {
    /* Where to access the document */
    attachment: Attachment;
    /* Format/content rules for the document */
    format?: 'Coding';
  };
}

/* An ingredient of a manufactured item or pharmaceutical product. */
export interface MedicinalProductIngredient extends DomainResource, Resource<'MedicinalProductIngredient'> {
  _allergenicIndicator?: Element;
  /* If the ingredient is a known or suspected allergen */
  allergenicIndicator?: boolean;
  specifiedSubstance?: {
    /* The group of specified substance, e.g. group 1 to 4 */
    group: CodeableConcept;
    strength?: {
      /* For when strength is measured at a particular point or distance */
      measurementPoint?: string;
      /* A lower limit for the strength per unitary volume (or mass), for when there is a range. The concentration attribute then becomes the upper limit */
      concentrationLowLimit?: Ratio;
      /* The quantity of substance in the unit of presentation, or in the volume (or mass) of the single pharmaceutical product or manufactured item */
      presentation: Ratio;
      /* The strength per unitary volume (or mass) */
      concentration?: Ratio;
      referenceStrength?: {
        /* Relevant reference substance */
        substance?: CodeableConcept;
        /* Strength expressed in terms of a reference substance */
        strength: Ratio;
        _measurementPoint?: Element;
        country?: CodeableConcept;
        /* Strength expressed in terms of a reference substance */
        strengthLowLimit?: Ratio;
        /* For when strength is measured at a particular point or distance */
        measurementPoint?: string;
      };
      /* A lower limit for the quantity of substance in the unit of presentation. For use when there is a range of strengths, this is the lower limit, with the presentation attribute becoming the upper limit */
      presentationLowLimit?: Ratio;
      country?: CodeableConcept;
      _measurementPoint?: Element;
    };
    /* The specified substance */
    code: CodeableConcept;
    /* Confidentiality level of the specified substance as the ingredient */
    confidentiality?: CodeableConcept;
  };
  manufacturer?: Array<Reference<'Organization'>>;
  /* The ingredient substance */
  substance?: {
    /* The ingredient substance */
    code: CodeableConcept;
    strength?: any;
  };
  /* Identifier for the ingredient */
  identifier?: Identifier;
  /* Ingredient role e.g. Active ingredient, excipient */
  role: CodeableConcept;
}

/* A complex extension allowing structured capture of the exposure risk of the patient for an adverse reaction (allergy or intolerance) to the specified substance/product. */
export interface allergyintoleranceSubstanceExposureRisk {
  /* Substance (or pharmaceutical product) */
  substance: CodeableConcept;
  /* known-reaction-risk | no-known-reaction-risk */
  exposureRisk: 'known-reaction-risk' | 'no-known-reaction-risk';
}

/* Identifies the kind(s) of attachment allowed to be sent for an element. */
export type mimeType = 'application/hl7-cda+xml';
/* Proficiency level of the communication. */
export interface patientProficiency {
  'type'?: Array<Coding>;
  /* The proficiency level of the communication */
  level?: 'E' | 'F' | 'G' | 'P';
}

/* Base StructureDefinition for DataRequirement Type: Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data. */
export interface DataRequirement extends Element {
  codeFilter?: {
    code?: Coding;
    _searchParam?: Element;
    /* A code-valued attribute to filter on */
    path?: string;
    _valueSet?: Element;
    /* A coded (token) parameter to search on */
    searchParam?: string;
    /* Valueset for the filter */
    valueSet?: canonical;
    _path?: Element;
  };
  sort?: {
    /* The name of the attribute to perform the sort */
    path: string;
    _path?: Element;
    _direction?: Element;
    /* ascending | descending */
    direction: 'ascending' | 'descending';
  };
  _profile?: Element;
  _mustSupport?: Element;
  /* Number of results */
  limit?: positiveInt;
  mustSupport?: string;
  /* The type of the required data */
  'type':
    | 'Any'
    | 'Type'
    | 'Address'
    | 'Age'
    | 'Annotation'
    | 'Attachment'
    | 'BackboneElement'
    | 'base64Binary'
    | 'boolean'
    | 'canonical'
    | 'code'
    | 'CodeableConcept'
    | 'Coding'
    | 'ContactDetail'
    | 'ContactPoint'
    | 'Contributor'
    | 'Count'
    | 'DataRequirement'
    | 'date'
    | 'dateTime'
    | 'decimal'
    | 'Distance'
    | 'Dosage'
    | 'Duration'
    | 'Element'
    | 'ElementDefinition'
    | 'Expression'
    | 'Extension'
    | 'HumanName'
    | 'id'
    | 'Identifier'
    | 'instant'
    | 'integer'
    | 'markdown'
    | 'MarketingStatus'
    | 'Meta'
    | 'Money'
    | 'MoneyQuantity'
    | 'Narrative'
    | 'oid'
    | 'ParameterDefinition'
    | 'Period'
    | 'Population'
    | 'positiveInt'
    | 'ProdCharacteristic'
    | 'ProductShelfLife'
    | 'Quantity'
    | 'Range'
    | 'Ratio'
    | 'Reference'
    | 'RelatedArtifact'
    | 'SampledData'
    | 'Signature'
    | 'string'
    | 'SubstanceAmount'
    | 'time'
    | 'Timing'
    | 'TriggerDefinition'
    | 'unsignedInt'
    | 'uri'
    | 'url'
    | 'UsageContext'
    | 'uuid'
    | 'xhtml'
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition';
  _type?: Element;
  profile?: canonical;
  _limit?: Element;
  dateFilter?: {
    /* A date valued parameter to search on */
    searchParam?: string;
    _path?: Element;
    _searchParam?: Element;
    /* A date-valued attribute to filter on */
    path?: string;
    /* The value of the filter, as a Period, DateTime, or Duration value */
    value?: {
      _dateTime?: Element;
      Period?: Period;
      dateTime?: dateTime;
      Duration?: Duration;
    };
  };
  /* E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
  subject?: {
    Reference?: Reference<'Group'>;
    CodeableConcept?: CodeableConcept;
  };
}

/* Information about a medication that is used to support knowledge. */
export interface MedicationKnowledge extends DomainResource, Resource<'MedicationKnowledge'> {
  /* Amount of drug in package */
  amount?: Quantity;
  cost?: {
    /* The source or owner for the price information */
    source?: string;
    /* The price of the medication */
    cost: Money;
    /* The category of the cost information */
    'type': CodeableConcept;
    _source?: Element;
  };
  /* The instructions for preparing the medication */
  preparationInstruction?: markdown;
  kinetics?: {
    lethalDose50?: Quantity;
    /* Time required for concentration in the body to decrease by half */
    halfLifePeriod?: Duration;
    areaUnderCurve?: Quantity;
  };
  associatedMedication?: Array<Reference<'Medication'>>;
  medicineClassification?: {
    classification?: CodeableConcept;
    /* The type of category for the medication (for example, therapeutic classification, therapeutic sub-classification) */
    'type': CodeableConcept;
  };
  _preparationInstruction?: Element;
  _synonym?: Element;
  administrationGuidelines?: {
    /* Indication for use that apply to the specific administration guidelines */
    indication?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'ObservationDefinition'>;
    };
    patientCharacteristics?: {
      _value?: Element;
      /* Specific characteristic that is relevant to the administration guideline */
      characteristic?: {
        CodeableConcept?: CodeableConcept;
        Quantity?: Quantity;
      };
      value?: string;
    };
    dosage?: {
      /* Type of dosage */
      'type': CodeableConcept;
      dosage: Dosage;
    };
  };
  /* Code that identifies this medication */
  code?: CodeableConcept;
  /* powder | tablets | capsule + */
  doseForm?: CodeableConcept;
  monograph?: {
    /* Associated documentation about the medication */
    source?: Reference<'DocumentReference' | 'Media'>;
    /* The category of medication document */
    'type'?: CodeableConcept;
  };
  regulatory?: {
    substitution?: {
      /* Specifies if regulation allows for changes in the medication when dispensing */
      allowed: boolean;
      _allowed?: Element;
      /* Specifies the type of substitution allowed */
      'type': CodeableConcept;
    };
    schedule?: {
      /* Specifies the specific drug schedule */
      schedule: CodeableConcept;
    };
    /* Specifies the authority of the regulation */
    regulatoryAuthority: Reference<'Organization'>;
    /* The maximum number of units of the medication that can be dispensed in a period */
    maxDispense?: {
      /* The maximum number of units of the medication that can be dispensed */
      quantity: Quantity;
      /* The period that applies to the maximum number of units */
      period?: Duration;
    };
  };
  ingredient?: {
    _isActive?: Element;
    /* Active ingredient indicator */
    isActive?: boolean;
    /* Medication(s) or substance(s) contained in the medication */
    item?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Substance'>;
    };
    /* Quantity of ingredient present */
    strength?: Ratio;
  };
  intendedRoute?: CodeableConcept;
  contraindication?: Array<Reference<'DetectedIssue'>>;
  relatedMedicationKnowledge?: {
    /* Category of medicationKnowledge */
    'type': CodeableConcept;
    reference: Array<Reference<'MedicationKnowledge'>>;
  };
  /* active | inactive | entered-in-error */
  status?: 'active' | 'entered-in-error' | 'inactive';
  synonym?: string;
  _status?: Element;
  /* Manufacturer of the item */
  manufacturer?: Reference<'Organization'>;
  drugCharacteristic?: {
    /* Code specifying the type of characteristic of medication */
    'type'?: CodeableConcept;
    /* Description of the characteristic */
    value?: {
      _string?: Element;
      Quantity?: Quantity;
      CodeableConcept?: CodeableConcept;
      string?: string;
      _base64Binary?: Element;
      base64Binary?: base64Binary;
    };
  };
  /* Details about packaged medications */
  packaging?: {
    /* The number of product units the package would contain if fully loaded */
    quantity?: Quantity;
    /* A code that defines the specific type of packaging that the medication can be found in */
    'type'?: CodeableConcept;
  };
  monitoringProgram?: {
    /* Name of the reviewing program */
    name?: string;
    _name?: Element;
    /* Type of program under which the medication is monitored */
    'type'?: CodeableConcept;
  };
  productType?: CodeableConcept;
}

/* The ChargeItemDefinition resource provides the properties that apply to the (billing) codes necessary to calculate costs and prices. The properties may differ largely depending on type and realm, therefore this resource gives only a rough structure and requires profiling for each type of billing code system. */
export interface ChargeItemDefinition extends DomainResource, Resource<'ChargeItemDefinition'> {
  _approvalDate?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _publisher?: Element;
  _date?: Element;
  /* Billing codes or product types this definition applies to */
  code?: CodeableConcept;
  _title?: Element;
  _version?: Element;
  _experimental?: Element;
  contact?: ContactDetail;
  /* When the charge item definition was approved by publisher */
  approvalDate?: date;
  derivedFromUri?: uri;
  _replaces?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  partOf?: canonical;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  replaces?: canonical;
  identifier?: Identifier;
  /* Date last changed */
  date?: dateTime;
  /* Natural language description of the charge item definition */
  description?: markdown;
  _description?: Element;
  useContext?: UsageContext;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Business version of the charge item definition */
  version?: string;
  applicability?: {
    /* Boolean-valued expression */
    expression?: string;
    /* Language of the expression */
    language?: string;
    _language?: Element;
    /* Natural language description of the condition */
    description?: string;
    _description?: Element;
    _expression?: Element;
  };
  _lastReviewDate?: Element;
  instance?: Array<Reference<'Medication' | 'Device' | 'Substance'>>;
  propertyGroup?: {
    applicability?: any;
    priceComponent?: {
      _type?: Element;
      /* base | surcharge | deduction | discount | tax | informational */
      'type': 'base' | 'deduction' | 'discount' | 'informational' | 'surcharge' | 'tax';
      _factor?: Element;
      /* Monetary amount associated with this component */
      amount?: Money;
      /* Factor used for calculating this component */
      factor?: decimal;
      /* Code identifying the specific component */
      code?: CodeableConcept;
    };
  };
  _derivedFromUri?: Element;
  _partOf?: Element;
  _url?: Element;
  /* When the charge item definition is expected to be used */
  effectivePeriod?: Period;
  /* Canonical identifier for this charge item definition, represented as a URI (globally unique) */
  url: uri;
  _status?: Element;
  jurisdiction?: CodeableConcept;
  _copyright?: Element;
  /* Name for this charge item definition (human friendly) */
  title?: string;
  /* When the charge item definition was last reviewed */
  lastReviewDate?: date;
}

export interface Location extends DomainResource, Resource<'Location'> {
  'type'?: CodeableConcept;
  /* Additional details about the location that could be displayed as further information to identify the location beyond its name */
  description?: string;
  /* instance | kind */
  mode?: 'instance' | 'kind';
  /* active | suspended | inactive */
  status?: 'active' | 'inactive' | 'suspended';
  _alias?: Element;
  _availabilityExceptions?: Element;
  /* Physical form of the location */
  physicalType?: CodeableConcept;
  _status?: Element;
  telecom?: ContactPoint;
  /* Organization responsible for provisioning and upkeep */
  managingOrganization?: Reference<'Organization'>;
  _name?: Element;
  endpoint?: Array<Reference<'Endpoint'>>;
  _mode?: Element;
  /* Another Location this one is physically a part of */
  partOf?: Reference<'Location'>;
  /* The operational status of the location (typically only for a bed/room) */
  operationalStatus?: 'C' | 'H' | 'I' | 'K' | 'O' | 'U';
  /* Physical location */
  address?: Address;
  alias?: string;
  /* Description of availability exceptions */
  availabilityExceptions?: string;
  identifier?: Identifier;
  hoursOfOperation?: {
    _openingTime?: Element;
    _closingTime?: Element;
    _allDay?: Element;
    _daysOfWeek?: Element;
    daysOfWeek?: Array<'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed'>;
    /* Time that the Location opens */
    openingTime?: time;
    /* The Location is open all day */
    allDay?: boolean;
    /* Time that the Location closes */
    closingTime?: time;
  };
  /* Name of the location as used by humans */
  name?: string;
  _description?: Element;
  /* The absolute geographic location */
  position?: {
    /* Altitude with WGS84 datum */
    altitude?: decimal;
    /* Latitude with WGS84 datum */
    latitude: decimal;
    /* Longitude with WGS84 datum */
    longitude: decimal;
    _longitude?: Element;
    _latitude?: Element;
    _altitude?: Element;
  };
}

export interface HealthcareService extends DomainResource, Resource<'HealthcareService'> {
  /* Description of service as presented to a consumer while searching */
  name?: string;
  specialty?: Array<CodeableConcept>;
  _comment?: Element;
  program?: CodeableConcept;
  /* Whether this HealthcareService record is in active use */
  active?: boolean;
  location?: Array<Reference<'Location'>>;
  /* Organization that provides this service */
  providedBy?: Reference<'Organization'>;
  /* Extra details about the service that can't be placed in the other fields */
  extraDetails?: markdown;
  communication?: Array<CodeableConcept>;
  notAvailable?: {
    _description?: Element;
    /* Reason presented to the user explaining why time not available */
    description: string;
    /* Service not available from this date */
    during?: Period;
  };
  _availabilityExceptions?: Element;
  identifier?: Identifier;
  _name?: Element;
  /* Additional description and/or any specific issues not covered elsewhere */
  comment?: string;
  /* Facilitates quick identification of the service */
  photo?: Attachment;
  serviceProvisionCode?: CodeableConcept;
  telecom?: ContactPoint;
  /* Description of availability exceptions */
  availabilityExceptions?: string;
  referralMethod?: CodeableConcept;
  characteristic?: CodeableConcept;
  coverageArea?: Array<Reference<'Location'>>;
  availableTime?: {
    _availableStartTime?: Element;
    _allDay?: Element;
    /* Always available? e.g. 24 hour service */
    allDay?: boolean;
    _daysOfWeek?: Element;
    daysOfWeek?: Array<'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed'>;
    /* Opening time of day (ignored if allDay = true) */
    availableStartTime?: time;
    _availableEndTime?: Element;
    /* Closing time of day (ignored if allDay = true) */
    availableEndTime?: time;
  };
  endpoint?: Array<Reference<'Endpoint'>>;
  'type'?: CodeableConcept;
  category?: CodeableConcept;
  /* If an appointment is required for access to this service */
  appointmentRequired?: boolean;
  _active?: Element;
  _appointmentRequired?: Element;
  _extraDetails?: Element;
  eligibility?: {
    _comment?: Element;
    /* Describes the eligibility conditions for the service */
    comment?: markdown;
    /* Coded value for the eligibility */
    code?: CodeableConcept;
  };
}

/* Todo. */
export interface SubstancePolymer extends DomainResource, Resource<'SubstancePolymer'> {
  /* Todo */
  class?: CodeableConcept;
  _modification?: Element;
  /* Todo */
  geometry?: CodeableConcept;
  modification?: string;
  monomerSet?: {
    /* Todo */
    ratioType?: CodeableConcept;
    startingMaterial?: {
      /* Todo */
      'type'?: CodeableConcept;
      /* Todo */
      material?: CodeableConcept;
      /* Todo */
      amount?: SubstanceAmount;
      _isDefining?: Element;
      /* Todo */
      isDefining?: boolean;
    };
  };
  copolymerConnectivity?: CodeableConcept;
  repeat?: {
    /* Todo */
    numberOfUnits?: integer;
    _averageMolecularFormula?: Element;
    repeatUnit?: {
      /* Todo */
      orientationOfPolymerisation?: CodeableConcept;
      degreeOfPolymerisation?: {
        /* Todo */
        amount?: SubstanceAmount;
        /* Todo */
        degree?: CodeableConcept;
      };
      /* Todo */
      amount?: SubstanceAmount;
      _repeatUnit?: Element;
      /* Todo */
      repeatUnit?: string;
      structuralRepresentation?: {
        /* Todo */
        'type'?: CodeableConcept;
        /* Todo */
        attachment?: Attachment;
        _representation?: Element;
        /* Todo */
        representation?: string;
      };
    };
    _numberOfUnits?: Element;
    /* Todo */
    repeatUnitAmountType?: CodeableConcept;
    /* Todo */
    averageMolecularFormula?: string;
  };
}

/* The minimum allowable value set, for use when the binding strength is 'required' or 'extensible'. This value set is the minimum value set that any conformant system SHALL support. */
export interface elementdefinitionMinValueSet {
  uri?: uri;
  canonical?: canonical;
}

/* This resource provides eligibility and plan details from the processing of an CoverageEligibilityRequest resource. */
export interface CoverageEligibilityResponse extends DomainResource, Resource<'CoverageEligibilityResponse'> {
  /* Coverage issuer */
  insurer: Reference<'Organization'>;
  /* Disposition Message */
  disposition?: string;
  /* Response creation date */
  created: dateTime;
  error?: {
    /* Error code detailing processing issues */
    code: CodeableConcept;
  };
  _disposition?: Element;
  _status?: Element;
  insurance?: {
    /* Coverage inforce indicator */
    inforce?: boolean;
    /* When the benefits are applicable */
    benefitPeriod?: Period;
    /* Insurance information */
    coverage: Reference<'Coverage'>;
    item?: {
      /* Preauthorization requirements endpoint */
      authorizationUrl?: uri;
      /* In or out of network */
      network?: CodeableConcept;
      /* Performing practitioner */
      provider?: Reference<'Practitioner' | 'PractitionerRole'>;
      authorizationSupporting?: CodeableConcept;
      benefit?: {
        /* Benefit classification */
        'type': CodeableConcept;
        /* Benefits used */
        used?: {
          unsignedInt?: unsignedInt;
          Money?: Money;
          string?: string;
          _unsignedInt?: Element;
          _string?: Element;
        };
        /* Benefits allowed */
        allowed?: {
          _string?: Element;
          string?: string;
          unsignedInt?: unsignedInt;
          Money?: Money;
          _unsignedInt?: Element;
        };
      };
      /* Individual or family */
      unit?: CodeableConcept;
      modifier?: CodeableConcept;
      /* Billing, service, product, or drug code */
      productOrService?: CodeableConcept;
      /* Short name for the benefit */
      name?: string;
      _name?: Element;
      _authorizationRequired?: Element;
      /* Description of the benefit or services covered */
      description?: string;
      /* Excluded from the plan */
      excluded?: boolean;
      _excluded?: Element;
      /* Benefit classification */
      category?: CodeableConcept;
      /* Annual or lifetime */
      term?: CodeableConcept;
      /* Authorization required flag */
      authorizationRequired?: boolean;
      _authorizationUrl?: Element;
      _description?: Element;
    };
    _inforce?: Element;
  };
  /* Preauthorization reference */
  preAuthRef?: string;
  purpose: Array<'auth-requirements' | 'benefits' | 'discovery' | 'validation'>;
  /* Eligibility request reference */
  request: Reference<'CoverageEligibilityRequest'>;
  identifier?: Identifier;
  _outcome?: Element;
  /* queued | complete | error | partial */
  outcome: 'complete' | 'error' | 'partial' | 'queued';
  /* Party responsible for the request */
  requestor?: Reference<'Practitioner' | 'PractitionerRole' | 'Organization'>;
  /* Estimated date or dates of service */
  serviced?: {
    Period?: Period;
    _date?: Element;
    date?: date;
  };
  /* Intended recipient of products and services */
  patient: Reference<'Patient'>;
  _created?: Element;
  _preAuthRef?: Element;
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  /* Printed form identifier */
  form?: CodeableConcept;
  _purpose?: Element;
}

/* The nationality of the patient. */
export interface patientNationality {
  /* Nationality Period */
  period?: Period;
  /* Nationality Code */
  code?: CodeableConcept;
}

export interface AthenaAppointmentType {
  [key: string]: any;
}

/* Base StructureDefinition for Address Type: An address expressed using postal conventions (as opposed to GPS or other location definition formats).  This data type may be used to convey addresses for use in delivering mail as well as for visiting locations which might not be valid for mail delivery.  There are a variety of postal address formats defined around the world. */
export interface Address extends Element {
  _use?: Element;
  /* District name (aka county) */
  district?: string;
  /* Time period when address was/is in use */
  period?: Period;
  /* home | work | temp | old | billing - purpose of this address */
  use?: 'billing' | 'home' | 'old' | 'temp' | 'work';
  line?: string;
  _country?: Element;
  _district?: Element;
  /* Name of city, town etc. */
  city?: string;
  /* Sub-unit of country (abbreviations ok) */
  state?: string;
  _postalCode?: Element;
  /* Text representation of the address */
  text?: string;
  _type?: Element;
  /* postal | physical | both */
  'type'?: 'both' | 'physical' | 'postal';
  _line?: Element;
  _state?: Element;
  _text?: Element;
  /* Country (e.g. can be ISO 3166 2 or 3 letter code) */
  country?: string;
  _city?: Element;
  /* Postal code for area */
  postalCode?: string;
}

/* The specific diagnostic investigations that are requested as part of this request. Sometimes, there can only be one item per request, but in most contexts, more than one investigation can be requested. */
export interface servicerequestGeneticsItem {
  /* Code to indicate the item (test, panel or sequence variant) being ordered */
  code: CodeableConcept;
  /* Indicate the genetic variant ordered to be tested */
  geneticsObservation?: Reference<'Observation'>;
  /* If this item relates to specific specimens */
  specimen?: Reference<'Specimen'>;
  /* proposed | draft | planned | requested | received | accepted | in-progress | review | completed | cancelled | suspended | rejected | failed */
  status?: code;
}

export interface Resource extends Resource<'Resource'> {
  systemAccount: Reference<'SystemAccount'>;
}

/* Actual or  potential/avoided event causing unintended physical injury resulting from or contributed to by medical care, a research study or other healthcare setting factors that requires additional monitoring, treatment, or hospitalization, or that results in death. */
export interface AdverseEvent extends DomainResource, Resource<'AdverseEvent'> {
  /* Type of the event itself in relation to the subject */
  event?: CodeableConcept;
  suspectEntity?: {
    /* Refers to the specific entity that caused the adverse event */
    instance: Reference<
      | 'Device'
      | 'Procedure'
      | 'Substance'
      | 'Medication'
      | 'MedicationStatement'
      | 'Immunization'
      | 'MedicationAdministration'
    >;
    causality?: {
      /* Assessment of if the entity caused the event */
      assessment?: CodeableConcept;
      _productRelatedness?: Element;
      /* ProbabilityScale | Bayesian | Checklist */
      method?: CodeableConcept;
      /* AdverseEvent.suspectEntity.causalityAuthor */
      author?: Reference<'PractitionerRole' | 'Practitioner'>;
      /* AdverseEvent.suspectEntity.causalityProductRelatedness */
      productRelatedness?: string;
    };
  };
  _actuality?: Element;
  _recordedDate?: Element;
  /* Subject impacted by event */
  subject: Reference<'Group' | 'Patient' | 'Practitioner' | 'RelatedPerson'>;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* actual | potential */
  actuality: 'potential' | 'actual';
  contributor?: Array<Reference<'Device' | 'Practitioner' | 'PractitionerRole'>>;
  /* resolved | recovering | ongoing | resolvedWithSequelae | fatal | unknown */
  outcome?: 'fatal' | 'ongoing' | 'recovering' | 'resolved' | 'resolvedWithSequelae' | 'unknown';
  /* Who recorded the adverse event */
  recorder?: Reference<'PractitionerRole' | 'Practitioner' | 'Patient' | 'RelatedPerson'>;
  subjectMedicalHistory?: Array<
    Reference<
      | 'DocumentReference'
      | 'Condition'
      | 'Media'
      | 'Observation'
      | 'Procedure'
      | 'Immunization'
      | 'FamilyMemberHistory'
      | 'AllergyIntolerance'
    >
  >;
  /* When the event occurred */
  date?: dateTime;
  referenceDocument?: Array<Reference<'DocumentReference'>>;
  /* Seriousness of the event */
  seriousness?: CodeableConcept;
  _date?: Element;
  _detected?: Element;
  category?: CodeableConcept;
  resultingCondition?: Array<Reference<'Condition'>>;
  study?: Array<Reference<'ResearchStudy'>>;
  /* mild | moderate | severe */
  severity?: 'mild' | 'moderate' | 'severe';
  /* Business identifier for the event */
  identifier?: Identifier;
  /* When the event was detected */
  detected?: dateTime;
  /* Location where adverse event occurred */
  location?: Reference<'Location'>;
  /* When the event was recorded */
  recordedDate?: dateTime;
}

/* A process where a researcher or organization plans and then executes a series of steps intended to increase the field of healthcare-related knowledge.  This includes studies of safety, efficacy, comparative effectiveness and other information about medications, devices, therapies and other interventional and investigative techniques.  A ResearchStudy involves the gathering of information about human or animal subjects. */
export interface ResearchStudy extends DomainResource, Resource<'ResearchStudy'> {
  enrollment?: Array<Reference<'Group'>>;
  /* What this is study doing */
  description?: markdown;
  /* accrual-goal-met | closed-due-to-toxicity | closed-due-to-lack-of-study-progress | temporarily-closed-per-study-design */
  reasonStopped?: CodeableConcept;
  relatedArtifact?: RelatedArtifact;
  keyword?: CodeableConcept;
  /* n-a | early-phase-1 | phase-1 | phase-1-phase-2 | phase-2 | phase-2-phase-3 | phase-3 | phase-4 */
  phase?: CodeableConcept;
  partOf?: Array<Reference<'ResearchStudy'>>;
  _status?: Element;
  site?: Array<Reference<'Location'>>;
  note?: Annotation;
  contact?: ContactDetail;
  _description?: Element;
  location?: CodeableConcept;
  /* When the study began and ended */
  period?: Period;
  condition?: CodeableConcept;
  arm?: {
    _name?: Element;
    _description?: Element;
    /* Short explanation of study path */
    description?: string;
    /* Categorization of study arm */
    'type'?: CodeableConcept;
    /* Label for study arm */
    name: string;
  };
  /* treatment | prevention | diagnostic | supportive-care | screening | health-services-research | basic-science | device-feasibility */
  primaryPurposeType?: CodeableConcept;
  /* Organization that initiates and is legally responsible for the study */
  sponsor?: Reference<'Organization'>;
  objective?: {
    _name?: Element;
    /* Label for the objective */
    name?: string;
    /* primary | secondary | exploratory */
    'type'?: 'exploratory' | 'primary' | 'secondary';
  };
  category?: CodeableConcept;
  focus?: CodeableConcept;
  /* Researcher who oversees multiple aspects of the study */
  principalInvestigator?: Reference<'Practitioner' | 'PractitionerRole'>;
  identifier?: Identifier;
  protocol?: Array<Reference<'PlanDefinition'>>;
  /* active | administratively-completed | approved | closed-to-accrual | closed-to-accrual-and-intervention | completed | disapproved | in-review | temporarily-closed-to-accrual | temporarily-closed-to-accrual-and-intervention | withdrawn */
  status:
    | 'active'
    | 'administratively-completed'
    | 'approved'
    | 'closed-to-accrual'
    | 'closed-to-accrual-and-intervention'
    | 'completed'
    | 'disapproved'
    | 'in-review'
    | 'temporarily-closed-to-accrual'
    | 'temporarily-closed-to-accrual-and-intervention'
    | 'withdrawn';
  /* Name for this study */
  title?: string;
  _title?: Element;
}

export type RPCgetSlot = {
  method: 'relatient.book/get-slot';
  params: {
    [key: string]: any;
  };
};
export interface CampaignGroup extends Resource<'CampaignGroup'> {
  name: string;
  systemAccount: Reference<'SystemAccount'>;
}

export type RPCgetPractitionerInfo = {
  method: 'relatient.practitioner/get-practitioner-info';
  params: {
    [key: string]: any;
  };
};
export type RPCloadDepartments = {
  method: 'relatient.pmsystem/load-departments';
  params: {
    'pm-id': string;
    account: string;
  };
};
export interface Consent extends DomainResource, Resource<'Consent'> {
  /* Source from which this consent is taken */
  source?: {
    Reference?: Reference<'Consent' | 'QuestionnaireResponse' | 'Contract' | 'DocumentReference'>;
    Attachment?: Attachment;
  };
  identifier?: Identifier;
  category: CodeableConcept;
  /* Regulation that this consents to */
  policyRule?: CodeableConcept;
  /* Which of the four areas this resource covers (extensible) */
  scope: CodeableConcept;
  performer?: Array<Reference<'PractitionerRole' | 'Organization' | 'RelatedPerson' | 'Practitioner' | 'Patient'>>;
  /* Constraints to the base Consent.policyRule */
  provision?: {
    /* deny | permit */
    'type'?: 'deny' | 'permit';
    provision?: any;
    action?: CodeableConcept;
    /* Timeframe for data controlled by this rule */
    dataPeriod?: Period;
    securityLabel?: Coding;
    actor?: {
      /* How the actor is involved */
      role: CodeableConcept;
      /* Resource for the actor (or group, by role) */
      reference: Reference<
        | 'Patient'
        | 'Practitioner'
        | 'Organization'
        | 'RelatedPerson'
        | 'PractitionerRole'
        | 'CareTeam'
        | 'Group'
        | 'Device'
      >;
    };
    _type?: Element;
    code?: CodeableConcept;
    /* Timeframe for this rule */
    period?: Period;
    data?: {
      _meaning?: Element;
      /* instance | related | dependents | authoredby */
      meaning: 'authoredby' | 'dependents' | 'instance' | 'related';
      /* The actual data reference */
      reference: Reference<'Reference'>;
    };
    purpose?: Coding;
    class?: Coding;
  };
  /* Who the consent applies to */
  patient?: Reference<'Patient'>;
  policy?: {
    _authority?: Element;
    /* Specific policy covered by this consent */
    uri?: uri;
    _uri?: Element;
    /* Enforcement source for policy */
    authority?: uri;
  };
  _status?: Element;
  /* draft | proposed | active | rejected | inactive | entered-in-error */
  status: 'active' | 'draft' | 'entered-in-error' | 'inactive' | 'proposed' | 'rejected';
  _dateTime?: Element;
  /* When this Consent was created or indexed */
  dateTime?: dateTime;
  organization?: Array<Reference<'Organization'>>;
  verification?: {
    _verificationDate?: Element;
    _verified?: Element;
    /* Has been verified */
    verified: boolean;
    /* Person who verified */
    verifiedWith?: Reference<'RelatedPerson' | 'Patient'>;
    /* When consent verified */
    verificationDate?: dateTime;
  };
}

/* The Measure resource provides the definition of a quality measure. */
export interface Measure extends DomainResource, Resource<'Measure'> {
  _url?: Element;
  /* Describes the clinical usage of the measure */
  usage?: string;
  library?: canonical;
  group?: {
    population?: {
      /* The human readable description of this population criteria */
      description?: string;
      /* The criteria that defines this population */
      criteria: Expression;
      /* initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation */
      code?: CodeableConcept;
      _description?: Element;
    };
    stratifier?: {
      component?: {
        _description?: Element;
        /* The human readable description of this stratifier component */
        description?: string;
        /* Meaning of the stratifier component */
        code?: CodeableConcept;
        /* Component of how the measure should be stratified */
        criteria: Expression;
      };
      _description?: Element;
      /* Meaning of the stratifier */
      code?: CodeableConcept;
      /* The human readable description of this stratifier */
      description?: string;
      /* How the measure should be stratified */
      criteria?: Expression;
    };
    _description?: Element;
    /* Meaning of the group */
    code?: CodeableConcept;
    /* Summary description */
    description?: string;
  };
  /* opportunity | all-or-nothing | linear | weighted */
  compositeScoring?: CodeableConcept;
  jurisdiction?: CodeableConcept;
  reviewer?: ContactDetail;
  _subtitle?: Element;
  identifier?: Identifier;
  _status?: Element;
  /* Subordinate title of the measure */
  subtitle?: string;
  /* Business version of the measure */
  version?: string;
  useContext?: UsageContext;
  /* Canonical identifier for this measure, represented as a URI (globally unique) */
  url?: uri;
  /* increase | decrease */
  improvementNotation?: 'decrease' | 'increase';
  author?: ContactDetail;
  _copyright?: Element;
  /* When the measure was approved by publisher */
  approvalDate?: date;
  _lastReviewDate?: Element;
  /* Name for this measure (human friendly) */
  title?: string;
  topic?: CodeableConcept;
  _disclaimer?: Element;
  _guidance?: Element;
  definition?: markdown;
  _date?: Element;
  _description?: Element;
  /* When the measure is expected to be used */
  effectivePeriod?: Period;
  /* Name for this measure (computer friendly) */
  name?: string;
  /* How risk adjustment is applied for this measure */
  riskAdjustment?: string;
  contact?: ContactDetail;
  _name?: Element;
  supplementalData?: {
    usage?: CodeableConcept;
    /* The human readable description of this supplemental data */
    description?: string;
    /* Expression describing additional data to be reported */
    criteria: Expression;
    /* Meaning of the supplemental data */
    code?: CodeableConcept;
    _description?: Element;
  };
  _publisher?: Element;
  /* Summary of clinical guidelines */
  clinicalRecommendationStatement?: markdown;
  /* Why this measure is defined */
  purpose?: markdown;
  /* Additional guidance for implementers */
  guidance?: markdown;
  _approvalDate?: Element;
  /* proportion | ratio | continuous-variable | cohort */
  scoring?: CodeableConcept;
  'type'?: CodeableConcept;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  _experimental?: Element;
  endorser?: ContactDetail;
  _library?: Element;
  _purpose?: Element;
  /* E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
  subject?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Group'>;
  };
  _rationale?: Element;
  relatedArtifact?: RelatedArtifact;
  _clinicalRecommendationStatement?: Element;
  /* Detailed description of why the measure exists */
  rationale?: markdown;
  _version?: Element;
  /* When the measure was last reviewed */
  lastReviewDate?: date;
  /* How is rate aggregation performed for this measure */
  rateAggregation?: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Date last changed */
  date?: dateTime;
  _rateAggregation?: Element;
  _usage?: Element;
  /* Natural language description of the measure */
  description?: markdown;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _definition?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _riskAdjustment?: Element;
  editor?: ContactDetail;
  /* Disclaimer for use of the measure or its referenced content */
  disclaimer?: markdown;
  _title?: Element;
}

export type RPCgetPractitioners = {
  method: 'relatient.workshift/get-practitioners';
  params: {
    [key: string]: any;
  };
};
export type RPCcancelAppointment = {
  method: 'relatient.scheduling/cancel-appointment';
  params: {
    [key: string]: any;
  };
};
export type RPCgetAppointmentTypes = {
  method: 'relatient.workshift/get-appointment-types';
  params: {
    account: string;
    'pm-id': string;
  };
};
/* Describes the event of a patient consuming or otherwise being administered a medication.  This may be as simple as swallowing a tablet or it may be a long running infusion.  Related resources tie this event to the authorizing prescription, and the specific encounter between patient and health care practitioner. */
export interface MedicationAdministration extends DomainResource, Resource<'MedicationAdministration'> {
  reasonReference?: Array<Reference<'Condition' | 'Observation' | 'DiagnosticReport'>>;
  statusReason?: CodeableConcept;
  _status?: Element;
  /* Start and end time of administration */
  effective?: {
    _dateTime?: Element;
    dateTime?: dateTime;
    Period?: Period;
  };
  performer?: {
    /* Who performed the medication administration */
    actor: Reference<'RelatedPerson' | 'PractitionerRole' | 'Device' | 'Patient' | 'Practitioner'>;
    /* Type of performance */
    function?: CodeableConcept;
  };
  /* in-progress | not-done | on-hold | completed | entered-in-error | stopped | unknown */
  status: 'completed' | 'entered-in-error' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'unknown';
  _instantiates?: Element;
  /* Who received medication */
  subject: Reference<'Patient' | 'Group'>;
  supportingInformation?: Array<Reference<'Reference'>>;
  /* Type of medication usage */
  category?: 'community' | 'inpatient' | 'outpatient';
  /* Request administration performed against */
  request?: Reference<'MedicationRequest'>;
  /* Encounter or Episode of Care administered as part of */
  context?: Reference<'EpisodeOfCare' | 'Encounter'>;
  instantiates?: uri;
  reasonCode?: CodeableConcept;
  eventHistory?: Array<Reference<'Provenance'>>;
  device?: Array<Reference<'Device'>>;
  partOf?: Array<Reference<'MedicationAdministration' | 'Procedure'>>;
  identifier?: Identifier;
  note?: Annotation;
  /* What was administered */
  medication?: {
    Reference?: Reference<'Medication'>;
    CodeableConcept?: CodeableConcept;
  };
  /* Details of how medication was taken */
  dosage?: {
    _text?: Element;
    /* Path of substance into body */
    route?: CodeableConcept;
    /* Free text dosage instructions e.g. SIG */
    text?: string;
    /* Amount of medication per dose */
    dose?: Quantity;
    /* How drug was administered */
    method?: CodeableConcept;
    /* Dose quantity per unit of time */
    rate?: {
      Quantity?: Quantity;
      Ratio?: Ratio;
    };
    /* Body site administered to */
    site?: CodeableConcept;
  };
}

/* This resource provides enrollment and plan details from the processing of an EnrollmentRequest resource. */
export interface EnrollmentResponse extends DomainResource, Resource<'EnrollmentResponse'> {
  identifier?: Identifier;
  /* Insurer */
  organization?: Reference<'Organization'>;
  /* Claim reference */
  request?: Reference<'EnrollmentRequest'>;
  _created?: Element;
  /* Disposition Message */
  disposition?: string;
  /* Creation date */
  created?: dateTime;
  _disposition?: Element;
  /* Responsible practitioner */
  requestProvider?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* queued | complete | error | partial */
  outcome?: 'complete' | 'error' | 'partial' | 'queued';
  /* active | cancelled | draft | entered-in-error */
  status?: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  _status?: Element;
  _outcome?: Element;
}

/* Base StructureDefinition for Meta Type: The metadata about a resource. This is content in the resource that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource. */
export interface Meta extends Element {
  _source?: Element;
  _profile?: Element;
  tag?: Coding;
  /* Version specific identifier */
  versionId?: id;
  _lastUpdated?: Element;
  _versionId?: Element;
  profile?: canonical;
  /* When the resource version last changed */
  lastUpdated?: instant;
  /* Identifies where the resource comes from */
  source?: uri;
  security?: Coding;
}

/* A container for a collection of resources. */
export interface Bundle extends Resource<'Bundle'> {
  /* document | message | transaction | transaction-response | batch | batch-response | history | searchset | collection */
  'type':
    | 'batch'
    | 'batch-response'
    | 'collection'
    | 'document'
    | 'history'
    | 'message'
    | 'searchset'
    | 'transaction'
    | 'transaction-response';
  _total?: Element;
  link?: {
    _url?: Element;
    /* Reference details for the link */
    url: uri;
    /* See http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1 */
    relation: string;
    _relation?: Element;
  };
  _type?: Element;
  /* Digital Signature */
  signature?: Signature;
  /* Persistent identifier for the bundle */
  identifier?: Identifier;
  _timestamp?: Element;
  entry?: {
    _fullUrl?: Element;
    link?: any;
    /* Results of execution (transaction/batch/history) */
    response?: {
      /* OperationOutcome with hints and warnings (for batch/transaction) */
      outcome?: Resource;
      _location?: Element;
      /* Status response code (text optional) */
      status: string;
      /* The Etag for the resource (if relevant) */
      etag?: string;
      /* Server's date time modified */
      lastModified?: instant;
      _etag?: Element;
      _status?: Element;
      _lastModified?: Element;
      /* The location (if the operation returns a location) */
      location?: uri;
    };
    /* A resource in the bundle */
    resource?: Resource;
    /* URI for resource (Absolute URL server address or URI for UUID/OID) */
    fullUrl?: uri;
    /* Additional execution information (transaction/batch/history) */
    request?: {
      _ifNoneMatch?: Element;
      /* For conditional creates */
      ifNoneExist?: string;
      _url?: Element;
      _method?: Element;
      /* For managing cache currency */
      ifNoneMatch?: string;
      /* URL for HTTP equivalent of this entry */
      url: uri;
      /* For managing update contention */
      ifMatch?: string;
      _ifMatch?: Element;
      /* GET | HEAD | POST | PUT | DELETE | PATCH */
      method: 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT';
      _ifNoneExist?: Element;
      _ifModifiedSince?: Element;
      /* For managing cache currency */
      ifModifiedSince?: instant;
    };
    /* Search related information */
    search?: {
      _score?: Element;
      /* match | include | outcome - why this is in the result set */
      mode?: 'include' | 'match' | 'outcome';
      _mode?: Element;
      /* Search ranking (between 0 and 1) */
      score?: decimal;
    };
  };
  /* When the bundle was assembled */
  timestamp?: instant;
  /* If search, the total number of matches */
  total?: unsignedInt;
}

/* The CoverageEligibilityRequest provides patient and insurance coverage information to an insurer for them to respond, in the form of an CoverageEligibilityResponse, with information regarding whether the stated coverage is valid and in-force and optionally to provide the insurance details of the policy. */
export interface CoverageEligibilityRequest extends DomainResource, Resource<'CoverageEligibilityRequest'> {
  /* Coverage issuer */
  insurer: Reference<'Organization'>;
  /* Intended recipient of products and services */
  patient: Reference<'Patient'>;
  _purpose?: Element;
  /* Desired processing priority */
  priority?: CodeableConcept;
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  /* Author */
  enterer?: Reference<'PractitionerRole' | 'Practitioner'>;
  insurance?: {
    _focal?: Element;
    /* Insurance information */
    coverage: Reference<'Coverage'>;
    /* Additional provider contract number */
    businessArrangement?: string;
    _businessArrangement?: Element;
    /* Applicable coverage */
    focal?: boolean;
  };
  _created?: Element;
  supportingInfo?: {
    _appliesToAll?: Element;
    /* Applies to all items */
    appliesToAll?: boolean;
    /* Information instance identifier */
    sequence: positiveInt;
    _sequence?: Element;
    /* Data to be provided */
    information: Reference<'Reference'>;
  };
  /* Party responsible for the request */
  provider?: Reference<'Practitioner' | 'PractitionerRole' | 'Organization'>;
  /* Creation date */
  created: dateTime;
  purpose: Array<'auth-requirements' | 'benefits' | 'discovery' | 'validation'>;
  /* Estimated date or dates of service */
  serviced?: {
    Period?: Period;
    date?: date;
    _date?: Element;
  };
  identifier?: Identifier;
  /* Servicing facility */
  facility?: Reference<'Location'>;
  _status?: Element;
  item?: {
    supportingInfoSequence?: positiveInt;
    /* Servicing facility */
    facility?: Reference<'Location' | 'Organization'>;
    /* Fee, charge or cost per item */
    unitPrice?: Money;
    /* Perfoming practitioner */
    provider?: Reference<'PractitionerRole' | 'Practitioner'>;
    detail?: Array<Reference<'Reference'>>;
    /* Billing, service, product, or drug code */
    productOrService?: CodeableConcept;
    _supportingInfoSequence?: Element;
    diagnosis?: {
      /* Nature of illness or problem */
      diagnosis?: {
        Reference?: Reference<'Condition'>;
        CodeableConcept?: CodeableConcept;
      };
    };
    /* Benefit classification */
    category?: CodeableConcept;
    modifier?: CodeableConcept;
    /* Count of products or services */
    quantity?: Quantity;
  };
}

export interface Patient extends DomainResource, Resource<'Patient'> {
  _gender?: Element;
  generalPractitioner?: Array<Reference<'Organization' | 'Practitioner' | 'PractitionerRole'>>;
  _active?: Element;
  /* Whether this patient's record is in active use */
  active?: boolean;
  identifier?: Identifier;
  name?: HumanName;
  telecom?: ContactPoint;
  address?: Address;
  link?: {
    /* replaced-by | replaces | refer | seealso */
    'type': 'refer' | 'replaced-by' | 'replaces' | 'seealso';
    _type?: Element;
    /* The other patient or related person resource that the link refers to */
    other: Reference<'RelatedPerson' | 'Patient'>;
  };
  contact?: {
    /* Address for the contact person */
    address?: Address;
    /* A name associated with the contact person */
    name?: HumanName;
    /* Organization that is associated with the contact */
    organization?: Reference<'Organization'>;
    telecom?: ContactPoint;
    _gender?: Element;
    /* male | female | other | unknown */
    gender?: 'female' | 'male' | 'other' | 'unknown';
    relationship?: CodeableConcept;
    /* The period during which this contact person or organization is valid to be contacted relating to this patient */
    period?: Period;
  };
  /* Whether patient is part of a multiple birth */
  multipleBirth?: {
    _boolean?: Element;
    integer?: integer;
    _integer?: Element;
    boolean?: boolean;
  };
  /* Indicates if the individual is deceased or not */
  deceased?: {
    _boolean?: Element;
    dateTime?: dateTime;
    boolean?: boolean;
    _dateTime?: Element;
  };
  /* male | female | other | unknown */
  gender?: 'female' | 'male' | 'other' | 'unknown';
  photo?: Attachment;
  _birthDate?: Element;
  /* Marital (civil) status of a patient */
  maritalStatus?: CodeableConcept;
  communication?: {
    /* Language preference indicator */
    preferred?: boolean;
    _preferred?: Element;
    /* The language which can be used to communicate with the patient about his or her health */
    language:
      | 'ar'
      | 'bn'
      | 'cs'
      | 'da'
      | 'de'
      | 'de-AT'
      | 'de-CH'
      | 'de-DE'
      | 'el'
      | 'en'
      | 'en-AU'
      | 'en-CA'
      | 'en-GB'
      | 'en-IN'
      | 'en-NZ'
      | 'en-SG'
      | 'en-US'
      | 'es'
      | 'es-AR'
      | 'es-ES'
      | 'es-UY'
      | 'fi'
      | 'fr'
      | 'fr-BE'
      | 'fr-CH'
      | 'fr-FR'
      | 'fy'
      | 'fy-NL'
      | 'hi'
      | 'hr'
      | 'it'
      | 'it-CH'
      | 'it-IT'
      | 'ja'
      | 'ko'
      | 'nl'
      | 'nl-BE'
      | 'nl-NL'
      | 'no'
      | 'no-NO'
      | 'pa'
      | 'pl'
      | 'pt'
      | 'pt-BR'
      | 'ru'
      | 'ru-RU'
      | 'sr'
      | 'sr-RS'
      | 'sv'
      | 'sv-SE'
      | 'te'
      | 'zh'
      | 'zh-CN'
      | 'zh-HK'
      | 'zh-SG'
      | 'zh-TW';
  };
  /* Organization that is the custodian of the patient record */
  managingOrganization?: Reference<'Organization'>;
  /* The date of birth for the individual */
  birthDate?: date;
}

/* A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */
export interface NutritionOrder extends DomainResource, Resource<'NutritionOrder'> {
  instantiates?: uri;
  _instantiatesUri?: Element;
  _instantiatesCanonical?: Element;
  allergyIntolerance?: Array<Reference<'AllergyIntolerance'>>;
  /* Enteral formula components */
  enteralFormula?: {
    _baseFormulaProductName?: Element;
    /* Type of enteral or infant formula */
    baseFormulaType?: CodeableConcept;
    /* Upper limit on formula volume per unit of time */
    maxVolumeToDeliver?: Quantity;
    /* How the formula should enter the patient's gastrointestinal tract */
    routeofAdministration?: CodeableConcept;
    administration?: {
      /* Speed with which the formula is provided per period of time */
      rate?: {
        Ratio?: Ratio;
        Quantity?: Quantity;
      };
      /* Scheduled frequency of enteral feeding */
      schedule?: Timing;
      /* The volume of formula to provide */
      quantity?: Quantity;
    };
    /* Formula feeding instructions expressed as text */
    administrationInstruction?: string;
    /* Amount of energy per specified volume that is required */
    caloricDensity?: Quantity;
    _additiveProductName?: Element;
    _administrationInstruction?: Element;
    /* Type of modular component to add to the feeding */
    additiveType?: CodeableConcept;
    /* Product or brand name of the enteral or infant formula */
    baseFormulaProductName?: string;
    /* Product or brand name of the modular additive */
    additiveProductName?: string;
  };
  instantiatesCanonical?: canonical;
  identifier?: Identifier;
  /* The person who requires the diet, formula or nutritional supplement */
  patient: Reference<'Patient'>;
  note?: Annotation;
  _intent?: Element;
  excludeFoodModifier?: CodeableConcept;
  _instantiates?: Element;
  /* proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option */
  intent:
    | 'directive'
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order';
  instantiatesUri?: uri;
  /* draft | active | on-hold | revoked | completed | entered-in-error | unknown */
  status: 'active' | 'completed' | 'draft' | 'entered-in-error' | 'on-hold' | 'revoked' | 'unknown';
  /* Who ordered the diet, formula or nutritional supplement */
  orderer?: Reference<'Practitioner' | 'PractitionerRole'>;
  _status?: Element;
  /* Oral diet components */
  oralDiet?: {
    /* Instructions or additional information about the oral diet */
    instruction?: string;
    'type'?: CodeableConcept;
    schedule?: Timing;
    nutrient?: {
      /* Quantity of the specified nutrient */
      amount?: Quantity;
      /* Type of nutrient that is being modified */
      modifier?: CodeableConcept;
    };
    texture?: {
      /* Code to indicate how to alter the texture of the foods, e.g. pureed */
      modifier?: CodeableConcept;
      /* Concepts that are used to identify an entity that is ingested for nutritional purposes */
      foodType?: CodeableConcept;
    };
    fluidConsistencyType?: CodeableConcept;
    _instruction?: Element;
  };
  foodPreferenceModifier?: CodeableConcept;
  /* The encounter associated with this nutrition order */
  encounter?: Reference<'Encounter'>;
  supplement?: {
    _instruction?: Element;
    /* Instructions or additional information about the oral supplement */
    instruction?: string;
    /* Product or brand name of the nutritional supplement */
    productName?: string;
    _productName?: Element;
    /* Amount of the nutritional supplement */
    quantity?: Quantity;
    schedule?: Timing;
    /* Type of supplement product requested */
    'type'?: CodeableConcept;
  };
  _dateTime?: Element;
  /* Date and time the nutrition order was requested */
  dateTime: dateTime;
}

/* Base StructureDefinition for base64Binary Type: A stream of bytes */
export type base64Binary = string;
/* This resource is a non-persisted resource used to pass information into and back from an [operation](operations.html). It has no other use, and there is no RESTful endpoint associated with it. */
export interface Parameters extends Resource<'Parameters'> {
  parameter?: {
    /* Name from the definition */
    name: string;
    part?: any;
    _name?: Element;
    /* If parameter is a whole resource */
    resource?: Resource;
    /* If parameter is a data type */
    value?: {
      string?: string;
      _uri?: Element;
      _base64Binary?: Element;
      Age?: Age;
      Timing?: Timing;
      CodeableConcept?: CodeableConcept;
      Count?: Count;
      HumanName?: HumanName;
      Annotation?: Annotation;
      Attachment?: Attachment;
      ParameterDefinition?: ParameterDefinition;
      RelatedArtifact?: RelatedArtifact;
      Reference?: Reference<'Reference'>;
      UsageContext?: UsageContext;
      id?: id;
      decimal?: decimal;
      Identifier?: Identifier;
      Address?: Address;
      Contributor?: Contributor;
      _date?: Element;
      Duration?: Duration;
      Expression?: Expression;
      url?: url;
      Meta?: Meta;
      canonical?: canonical;
      time?: time;
      Dosage?: Dosage;
      _markdown?: Element;
      Quantity?: Quantity;
      _string?: Element;
      _unsignedInt?: Element;
      instant?: instant;
      base64Binary?: base64Binary;
      boolean?: boolean;
      oid?: oid;
      _code?: Element;
      Signature?: Signature;
      Coding?: Coding;
      DataRequirement?: DataRequirement;
      TriggerDefinition?: TriggerDefinition;
      _dateTime?: Element;
      positiveInt?: positiveInt;
      uri?: uri;
      unsignedInt?: unsignedInt;
      ContactPoint?: ContactPoint;
      _canonical?: Element;
      Distance?: Distance;
      Money?: Money;
      code?: code;
      date?: date;
      _integer?: Element;
      dateTime?: dateTime;
      _decimal?: Element;
      Range?: Range;
      _boolean?: Element;
      _oid?: Element;
      markdown?: markdown;
      uuid?: uuid;
      Period?: Period;
      Ratio?: Ratio;
      integer?: integer;
      _time?: Element;
      SampledData?: SampledData;
      _id?: Element;
      _instant?: Element;
      _positiveInt?: Element;
      _url?: Element;
      _uuid?: Element;
      ContactDetail?: ContactDetail;
    };
  };
}

/* The title or other name to display when referencing a resource by canonical URL. */
export type display = string;
/* A human language representation of the concept (resource/element), as a url that is a reference to a portion of the narrative of a resource ([DomainResource.text](narrative.html)). */
export type narrativeLink = url;
/* Variant information. */
export interface observationGeneticsVariant {
  /* HGVS nomenclature for observed DNA sequence variant */
  Name?: 'CodeableConcept';
  /* DNA sequence variant ID */
  Id?: CodeableConcept;
  /* DNA sequence variant type */
  Type?: CodeableConcept;
}

/* Human readable names for the valueset. */
export interface valuesetOtherName {
  /* Human readable, short and specific */
  name: string;
  /* Which name is preferred for this language */
  preferred?: boolean;
}

export interface CustomRule extends Resource<'CustomRule'> {
  status?: 'active' | 'inactive';
  'type': 'threshold-per-day' | 'threshold-per-week' | 'threshold-per-month';
  params?: {
    'cc-list'?: Array<string>;
    'property-list'?: {
      name: string;
      value: string;
    };
    age?: any;
    'service-list'?: Array<string>;
  };
  threshold: number;
  location?: Reference<'Location'>;
  'effective-period'?: {
    end?: dateTime;
    start?: dateTime;
  };
  practitioner?: Reference<'PractitionerRole'>;
}

export type RPCgetRule = {
  method: 'relatient.rule-engine-v2/get-rule';
  params: {
    [key: string]: any;
  };
};
export type RPCsubmitFullfilledRequest = {
  method: 'relatient.scheduling/submit-fullfilled-request';
  params: {
    [key: string]: any;
  };
};
/* A compartment definition that defines how resources are accessed on a server. */
export interface CompartmentDefinition extends DomainResource, Resource<'CompartmentDefinition'> {
  _purpose?: Element;
  _name?: Element;
  _code?: Element;
  /* Patient | Encounter | RelatedPerson | Practitioner | Device */
  code: 'Device' | 'Encounter' | 'Patient' | 'Practitioner' | 'RelatedPerson';
  /* Natural language description of the compartment definition */
  description?: markdown;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _experimental?: Element;
  /* Why this compartment definition is defined */
  purpose?: markdown;
  _version?: Element;
  /* Name for this compartment definition (computer friendly) */
  name: string;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Whether the search syntax is supported */
  search: boolean;
  /* Canonical identifier for this compartment definition, represented as a URI (globally unique) */
  url: uri;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Date last changed */
  date?: dateTime;
  useContext?: UsageContext;
  _date?: Element;
  /* Business version of the compartment definition */
  version?: string;
  resource?: {
    _documentation?: Element;
    _code?: Element;
    _param?: Element;
    /* Additional documentation about the resource and compartment */
    documentation?: string;
    param?: string;
    /* Name of resource type */
    code:
      | 'Account'
      | 'ActivityDefinition'
      | 'AdverseEvent'
      | 'AllergyIntolerance'
      | 'Appointment'
      | 'AppointmentResponse'
      | 'AuditEvent'
      | 'Basic'
      | 'Binary'
      | 'BiologicallyDerivedProduct'
      | 'BodyStructure'
      | 'Bundle'
      | 'CapabilityStatement'
      | 'CarePlan'
      | 'CareTeam'
      | 'CatalogEntry'
      | 'ChargeItem'
      | 'ChargeItemDefinition'
      | 'Claim'
      | 'ClaimResponse'
      | 'ClinicalImpression'
      | 'CodeSystem'
      | 'Communication'
      | 'CommunicationRequest'
      | 'CompartmentDefinition'
      | 'Composition'
      | 'ConceptMap'
      | 'Condition'
      | 'Consent'
      | 'Contract'
      | 'Coverage'
      | 'CoverageEligibilityRequest'
      | 'CoverageEligibilityResponse'
      | 'DetectedIssue'
      | 'Device'
      | 'DeviceDefinition'
      | 'DeviceMetric'
      | 'DeviceRequest'
      | 'DeviceUseStatement'
      | 'DiagnosticReport'
      | 'DocumentManifest'
      | 'DocumentReference'
      | 'DomainResource'
      | 'EffectEvidenceSynthesis'
      | 'Encounter'
      | 'Endpoint'
      | 'EnrollmentRequest'
      | 'EnrollmentResponse'
      | 'EpisodeOfCare'
      | 'EventDefinition'
      | 'Evidence'
      | 'EvidenceVariable'
      | 'ExampleScenario'
      | 'ExplanationOfBenefit'
      | 'FamilyMemberHistory'
      | 'Flag'
      | 'Goal'
      | 'GraphDefinition'
      | 'Group'
      | 'GuidanceResponse'
      | 'HealthcareService'
      | 'ImagingStudy'
      | 'Immunization'
      | 'ImmunizationEvaluation'
      | 'ImmunizationRecommendation'
      | 'ImplementationGuide'
      | 'InsurancePlan'
      | 'Invoice'
      | 'Library'
      | 'Linkage'
      | 'List'
      | 'Location'
      | 'Measure'
      | 'MeasureReport'
      | 'Media'
      | 'Medication'
      | 'MedicationAdministration'
      | 'MedicationDispense'
      | 'MedicationKnowledge'
      | 'MedicationRequest'
      | 'MedicationStatement'
      | 'MedicinalProduct'
      | 'MedicinalProductAuthorization'
      | 'MedicinalProductContraindication'
      | 'MedicinalProductIndication'
      | 'MedicinalProductIngredient'
      | 'MedicinalProductInteraction'
      | 'MedicinalProductManufactured'
      | 'MedicinalProductPackaged'
      | 'MedicinalProductPharmaceutical'
      | 'MedicinalProductUndesirableEffect'
      | 'MessageDefinition'
      | 'MessageHeader'
      | 'MolecularSequence'
      | 'NamingSystem'
      | 'NutritionOrder'
      | 'Observation'
      | 'ObservationDefinition'
      | 'OperationDefinition'
      | 'OperationOutcome';
  };
  _url?: Element;
  contact?: ContactDetail;
  _publisher?: Element;
  _description?: Element;
  _search?: Element;
  _status?: Element;
}

/* Logical Model: A pattern to be followed by resources that represent a specific proposal, plan and/or order for some sort of action or service. */
export type Request = any;
export type RPCsave = {
  method: 'rpc.elastic/save';
  params: {
    [key: string]: any;
  };
};
/* Describes a comparison of an immunization event against published recommendations to determine if the administration is "valid" in relation to those  recommendations. */
export interface ImmunizationEvaluation extends DomainResource, Resource<'ImmunizationEvaluation'> {
  identifier?: Identifier;
  /* Status of the dose relative to published recommendations */
  doseStatus: CodeableConcept;
  _description?: Element;
  /* Recommended number of doses for immunity */
  seriesDoses?: {
    _positiveInt?: Element;
    positiveInt?: positiveInt;
    _string?: Element;
    string?: string;
  };
  doseStatusReason?: CodeableConcept;
  _status?: Element;
  /* Dose number within series */
  doseNumber?: {
    string?: string;
    positiveInt?: positiveInt;
    _string?: Element;
    _positiveInt?: Element;
  };
  /* completed | entered-in-error */
  status: 'completed' | 'entered-in-error';
  /* Evaluation notes */
  description?: string;
  _date?: Element;
  /* Who this evaluation is for */
  patient: Reference<'Patient'>;
  /* Evaluation target disease */
  targetDisease: CodeableConcept;
  /* Date evaluation was performed */
  date?: dateTime;
  /* Who is responsible for publishing the recommendations */
  authority?: Reference<'Organization'>;
  _series?: Element;
  /* Immunization being evaluated */
  immunizationEvent: Reference<'Immunization'>;
  /* Name of vaccine series */
  series?: string;
}

/* A human language representation of the concept (resource/element) as seen/selected/uttered by the user who entered the data and/or which represents the full intended meaning of the user. This can be provided either directly as text, or as a url that is a reference to a portion of the narrative of a resource ([DomainResource.text](narrative.html)). */
export type originalText = string;
/* Base StructureDefinition for ProdCharacteristic Type: The marketing status describes the date when a medicinal product is actually put on the market or the date as of which it is no longer available. */
export interface ProdCharacteristic extends BackboneElement {
  image?: Attachment;
  /* Where applicable, the weight can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  weight?: Quantity;
  /* Where applicable, the depth can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  depth?: Quantity;
  /* Where applicable, the external diameter can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  externalDiameter?: Quantity;
  /* Where applicable, the height can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  height?: Quantity;
  _color?: Element;
  color?: string;
  imprint?: string;
  _imprint?: Element;
  /* Where applicable, the nominal volume can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  nominalVolume?: Quantity;
  _shape?: Element;
  /* Where applicable, the scoring can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used */
  scoring?: CodeableConcept;
  /* Where applicable, the shape can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used */
  shape?: string;
  /* Where applicable, the width can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  width?: Quantity;
}

/* The resource ChargeItem describes the provision of healthcare provider products for a certain patient, therefore referring not only to the product, but containing in addition details of the provision, like date, time, amounts and participating organizations and persons. Main Usage of the ChargeItem is to enable the billing process and internal cost allocation. */
export interface ChargeItem extends DomainResource, Resource<'ChargeItem'> {
  _factorOverride?: Element;
  reason?: CodeableConcept;
  _status?: Element;
  /* When the charged service was applied */
  occurrence?: {
    _dateTime?: Element;
    dateTime?: dateTime;
    Period?: Period;
    Timing?: Timing;
  };
  /* Price overriding the associated rules */
  priceOverride?: Money;
  supportingInformation?: Array<Reference<'Reference'>>;
  /* A code that identifies the charge, like a billing code */
  code: CodeableConcept;
  /* Encounter / Episode associated with event */
  context?: Reference<'Encounter' | 'EpisodeOfCare'>;
  /* Organization providing the charged service */
  performingOrganization?: Reference<'Organization'>;
  bodysite?: CodeableConcept;
  _definitionCanonical?: Element;
  /* Factor overriding the associated rules */
  factorOverride?: decimal;
  /* planned | billable | not-billable | aborted | billed | entered-in-error | unknown */
  status: 'aborted' | 'billable' | 'billed' | 'entered-in-error' | 'not-billable' | 'planned' | 'unknown';
  /* Individual who was entering */
  enterer?: Reference<'Device' | 'RelatedPerson' | 'PractitionerRole' | 'Practitioner' | 'Patient' | 'Organization'>;
  definitionCanonical?: canonical;
  /* Organization that has ownership of the (potential, future) revenue */
  costCenter?: Reference<'Organization'>;
  /* Individual service was done for/to */
  subject: Reference<'Patient' | 'Group'>;
  /* Organization requesting the charged service */
  requestingOrganization?: Reference<'Organization'>;
  service?: Array<
    Reference<
      | 'ImagingStudy'
      | 'Immunization'
      | 'Procedure'
      | 'SupplyDelivery'
      | 'Observation'
      | 'MedicationDispense'
      | 'MedicationAdministration'
      | 'DiagnosticReport'
    >
  >;
  partOf?: Array<Reference<'ChargeItem'>>;
  _enteredDate?: Element;
  account?: Array<Reference<'Account'>>;
  definitionUri?: uri;
  identifier?: Identifier;
  /* Reason for overriding the list price/factor */
  overrideReason?: string;
  /* Quantity of which the charge item has been serviced */
  quantity?: Quantity;
  /* Date the charge item was entered */
  enteredDate?: dateTime;
  /* Product charged */
  product?: {
    Reference?: Reference<'Substance' | 'Device' | 'Medication'>;
    CodeableConcept?: CodeableConcept;
  };
  performer?: {
    /* What type of performance was done */
    function?: CodeableConcept;
    /* Individual who was performing */
    actor: Reference<
      'RelatedPerson' | 'Patient' | 'PractitionerRole' | 'Organization' | 'Practitioner' | 'Device' | 'CareTeam'
    >;
  };
  note?: Annotation;
  _definitionUri?: Element;
  _overrideReason?: Element;
}

export type RPCgetSelfPortalCustomAttributes = {
  method: 'relatient.workshift/get-self-portal-custom-attributes';
  params: {
    [key: string]: any;
  };
};
/* A patient's point-in-time set of recommendations (i.e. forecasting) according to a published schedule with optional supporting justification. */
export interface ImmunizationRecommendation extends DomainResource, Resource<'ImmunizationRecommendation'> {
  /* Date recommendation(s) created */
  date: dateTime;
  /* Who this profile is for */
  patient: Reference<'Patient'>;
  _date?: Element;
  recommendation: {
    supportingImmunization?: Array<Reference<'ImmunizationEvaluation' | 'Immunization'>>;
    vaccineCode?: CodeableConcept;
    /* Protocol details */
    description?: string;
    /* Recommended dose number within series */
    doseNumber?: {
      _string?: Element;
      string?: string;
      _positiveInt?: Element;
      positiveInt?: positiveInt;
    };
    contraindicatedVaccineCode?: CodeableConcept;
    _series?: Element;
    forecastReason?: CodeableConcept;
    /* Vaccine recommendation status */
    forecastStatus: CodeableConcept;
    /* Name of vaccination series */
    series?: string;
    _description?: Element;
    /* Recommended number of doses for immunity */
    seriesDoses?: {
      string?: string;
      positiveInt?: positiveInt;
      _positiveInt?: Element;
      _string?: Element;
    };
    supportingPatientInformation?: Array<Reference<'Reference'>>;
    /* Disease to be immunized against */
    targetDisease?: CodeableConcept;
    dateCriterion?: {
      _value?: Element;
      /* Recommended date */
      value: dateTime;
      /* Type of date */
      code: CodeableConcept;
    };
  };
  /* Who is responsible for protocol */
  authority?: Reference<'Organization'>;
  identifier?: Identifier;
}

/* Ancestry information. */
export interface observationGeneticsAncestry {
  /* Ancestry name */
  Name: CodeableConcept;
  /* Source of ancestry report */
  Source?: CodeableConcept;
  /* Ancestry percentage */
  Percentage?: decimal;
}

/* The header for a message exchange that is either requesting or responding to an action.  The reference(s) that are the subject of the action as well as other information related to the action are typically transmitted in a bundle in which the MessageHeader resource instance is the first resource in the bundle. */
export interface MessageHeader extends DomainResource, Resource<'MessageHeader'> {
  /* The source of the data entry */
  enterer?: Reference<'Practitioner' | 'PractitionerRole'>;
  /* Real world sender of the message */
  sender?: Reference<'Practitioner' | 'PractitionerRole' | 'Organization'>;
  /* Message source application */
  source?: {
    /* Actual message source address or id */
    endpoint: url;
    _version?: Element;
    /* Name of system */
    name?: string;
    _software?: Element;
    _endpoint?: Element;
    _name?: Element;
    /* Name of software running the system */
    software?: string;
    /* Human contact for problems */
    contact?: ContactPoint;
    /* Version of software running */
    version?: string;
  };
  focus?: Array<Reference<'Reference'>>;
  _definition?: Element;
  /* The source of the decision */
  author?: Reference<'PractitionerRole' | 'Practitioner'>;
  destination?: {
    /* Particular delivery destination within the destination */
    target?: Reference<'Device'>;
    _endpoint?: Element;
    /* Actual destination address or id */
    endpoint: url;
    /* Name of system */
    name?: string;
    _name?: Element;
    /* Intended "real-world" recipient for the data */
    receiver?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  };
  /* Cause of event */
  reason?: CodeableConcept;
  /* If this is a reply to prior message */
  response?: {
    _identifier?: Element;
    /* ok | transient-error | fatal-error */
    code: 'fatal-error' | 'ok' | 'transient-error';
    /* Specific list of hints/warnings/errors */
    details?: Reference<'OperationOutcome'>;
    _code?: Element;
    /* Id of original message */
    identifier: id;
  };
  /* Code for the event this message represents or link to event definition */
  event?: {
    _uri?: Element;
    Coding?: Coding;
    uri?: uri;
  };
  /* Final responsibility for event */
  responsible?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* Link to the definition for this message */
  definition?: canonical;
}

/* Variable specifying a logic to generate a variable for use in subsequent logic.  The name of the variable will be added to FHIRPath's context when processing descendants of the element that contains this extension. */
export type variable = Expression;
/* Base StructureDefinition for xhtml Type */
export type xhtml = string;
export interface Rule {
  [key: string]: any;
}

export type RPCgetValueset = {
  method: 'relatient.terminology/get-valueset';
  params: {
    [key: string]: any;
  };
};
export type RPCbookAppt = {
  method: 'rpc.elastic/book-appt';
  params: {
    [key: string]: any;
  };
};
/* A formal computable definition of an operation (on the RESTful interface) or a named query (using the search interaction). */
export interface OperationDefinition extends DomainResource, Resource<'OperationDefinition'> {
  /* Name for this operation definition (computer friendly) */
  name: string;
  _name?: Element;
  _comment?: Element;
  _system?: Element;
  /* Name for this operation definition (human friendly) */
  title?: string;
  /* Name used to invoke the operation */
  code: code;
  _title?: Element;
  _base?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Marks this as a profile of the base */
  base?: canonical;
  _status?: Element;
  _inputProfile?: Element;
  overload?: {
    _comment?: Element;
    _parameterName?: Element;
    /* Comments to go on overload */
    comment?: string;
    parameterName?: string;
  };
  contact?: ContactDetail;
  /* Additional information about use */
  comment?: markdown;
  /* Natural language description of the operation definition */
  description?: markdown;
  parameter?: {
    _type?: Element;
    _max?: Element;
    /* What type this parameter has */
    'type'?:
      | 'Any'
      | 'Type'
      | 'Address'
      | 'Age'
      | 'Annotation'
      | 'Attachment'
      | 'BackboneElement'
      | 'base64Binary'
      | 'boolean'
      | 'canonical'
      | 'code'
      | 'CodeableConcept'
      | 'Coding'
      | 'ContactDetail'
      | 'ContactPoint'
      | 'Contributor'
      | 'Count'
      | 'DataRequirement'
      | 'date'
      | 'dateTime'
      | 'decimal'
      | 'Distance'
      | 'Dosage'
      | 'Duration'
      | 'Element'
      | 'ElementDefinition'
      | 'Expression'
      | 'Extension'
      | 'HumanName'
      | 'id'
      | 'Identifier'
      | 'instant'
      | 'integer'
      | 'markdown'
      | 'MarketingStatus'
      | 'Meta'
      | 'Money'
      | 'MoneyQuantity'
      | 'Narrative'
      | 'oid'
      | 'ParameterDefinition'
      | 'Period'
      | 'Population'
      | 'positiveInt'
      | 'ProdCharacteristic'
      | 'ProductShelfLife'
      | 'Quantity'
      | 'Range'
      | 'Ratio'
      | 'Reference'
      | 'RelatedArtifact'
      | 'SampledData'
      | 'Signature'
      | 'string'
      | 'SubstanceAmount'
      | 'time'
      | 'Timing'
      | 'TriggerDefinition'
      | 'unsignedInt'
      | 'uri'
      | 'url'
      | 'UsageContext'
      | 'uuid'
      | 'xhtml'
      | 'Account'
      | 'ActivityDefinition'
      | 'AdverseEvent'
      | 'AllergyIntolerance'
      | 'Appointment'
      | 'AppointmentResponse'
      | 'AuditEvent'
      | 'Basic'
      | 'Binary'
      | 'BiologicallyDerivedProduct'
      | 'BodyStructure'
      | 'Bundle'
      | 'CapabilityStatement'
      | 'CarePlan'
      | 'CareTeam'
      | 'CatalogEntry'
      | 'ChargeItem'
      | 'ChargeItemDefinition'
      | 'Claim'
      | 'ClaimResponse'
      | 'ClinicalImpression'
      | 'CodeSystem'
      | 'Communication'
      | 'CommunicationRequest'
      | 'CompartmentDefinition'
      | 'Composition'
      | 'ConceptMap'
      | 'Condition'
      | 'Consent'
      | 'Contract'
      | 'Coverage'
      | 'CoverageEligibilityRequest'
      | 'CoverageEligibilityResponse'
      | 'DetectedIssue'
      | 'Device'
      | 'DeviceDefinition';
    /* Minimum Cardinality */
    min: integer;
    referencedFrom?: {
      _sourceId?: Element;
      /* Element id of reference */
      sourceId?: string;
      /* Referencing parameter */
      source: string;
      _source?: Element;
    };
    _use?: Element;
    _searchType?: Element;
    /* in | out */
    use: 'in' | 'out';
    part?: any;
    _min?: Element;
    _documentation?: Element;
    /* Description of meaning/use */
    documentation?: string;
    _targetProfile?: Element;
    _name?: Element;
    /* Maximum Cardinality (a number or *) */
    max: string;
    /* number | date | string | token | reference | composite | quantity | uri | special */
    searchType?: 'composite' | 'date' | 'number' | 'quantity' | 'reference' | 'special' | 'string' | 'token' | 'uri';
    targetProfile?: canonical;
    /* ValueSet details if this is coded */
    binding?: {
      _valueSet?: Element;
      /* Source of value set */
      valueSet: canonical;
      /* required | extensible | preferred | example */
      strength: 'example' | 'extensible' | 'preferred' | 'required';
      _strength?: Element;
    };
    /* Name in Parameters.parameter.name or in URL */
    name: code;
  };
  /* Validation information for out parameters */
  outputProfile?: canonical;
  /* Invoke at the system level? */
  system: boolean;
  _affectsState?: Element;
  _purpose?: Element;
  /* Invoke on an instance? */
  instance: boolean;
  _date?: Element;
  resource?: Array<
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition'
    | 'DeviceMetric'
    | 'DeviceRequest'
    | 'DeviceUseStatement'
    | 'DiagnosticReport'
    | 'DocumentManifest'
    | 'DocumentReference'
    | 'DomainResource'
    | 'EffectEvidenceSynthesis'
    | 'Encounter'
    | 'Endpoint'
    | 'EnrollmentRequest'
    | 'EnrollmentResponse'
    | 'EpisodeOfCare'
    | 'EventDefinition'
    | 'Evidence'
    | 'EvidenceVariable'
    | 'ExampleScenario'
    | 'ExplanationOfBenefit'
    | 'FamilyMemberHistory'
    | 'Flag'
    | 'Goal'
    | 'GraphDefinition'
    | 'Group'
    | 'GuidanceResponse'
    | 'HealthcareService'
    | 'ImagingStudy'
    | 'Immunization'
    | 'ImmunizationEvaluation'
    | 'ImmunizationRecommendation'
    | 'ImplementationGuide'
    | 'InsurancePlan'
    | 'Invoice'
    | 'Library'
    | 'Linkage'
    | 'List'
    | 'Location'
    | 'Measure'
    | 'MeasureReport'
    | 'Media'
    | 'Medication'
    | 'MedicationAdministration'
    | 'MedicationDispense'
    | 'MedicationKnowledge'
    | 'MedicationRequest'
    | 'MedicationStatement'
    | 'MedicinalProduct'
    | 'MedicinalProductAuthorization'
    | 'MedicinalProductContraindication'
    | 'MedicinalProductIndication'
    | 'MedicinalProductIngredient'
    | 'MedicinalProductInteraction'
    | 'MedicinalProductManufactured'
    | 'MedicinalProductPackaged'
    | 'MedicinalProductPharmaceutical'
    | 'MedicinalProductUndesirableEffect'
    | 'MessageDefinition'
    | 'MessageHeader'
    | 'MolecularSequence'
    | 'NamingSystem'
    | 'NutritionOrder'
    | 'Observation'
    | 'ObservationDefinition'
    | 'OperationDefinition'
    | 'OperationOutcome'
  >;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _instance?: Element;
  jurisdiction?: CodeableConcept;
  /* Validation information for in parameters */
  inputProfile?: canonical;
  _description?: Element;
  /* Invoke at the type level? */
  'type': boolean;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Canonical identifier for this operation definition, represented as a URI (globally unique) */
  url?: uri;
  _type?: Element;
  _version?: Element;
  /* Why this operation definition is defined */
  purpose?: markdown;
  _kind?: Element;
  useContext?: UsageContext;
  _outputProfile?: Element;
  _url?: Element;
  _experimental?: Element;
  /* operation | query */
  kind: 'operation' | 'query';
  _publisher?: Element;
  /* Whether content is changed by the operation */
  affectsState?: boolean;
  /* Date last changed */
  date?: dateTime;
  _resource?: Element;
  /* Business version of the operation definition */
  version?: string;
  _code?: Element;
}

export type RPCgetValuesets = {
  method: 'relatient.terminology/get-valuesets';
  params: {
    [key: string]: any;
  };
};
/* Describes the event of a patient being administered a vaccine or a record of an immunization as reported by a patient, a clinician or another party. */
export interface Immunization extends DomainResource, Resource<'Immunization'> {
  /* Dose potency */
  isSubpotent?: boolean;
  /* How vaccine entered body */
  route?: CodeableConcept;
  /* Vaccine administration date */
  occurrence?: {
    string?: string;
    _string?: Element;
    _dateTime?: Element;
    dateTime?: dateTime;
  };
  performer?: {
    /* Individual or organization who was performing */
    actor: Reference<'Organization' | 'PractitionerRole' | 'Practitioner'>;
    /* What type of performance was done */
    function?: CodeableConcept;
  };
  note?: Annotation;
  /* Indicates context the data was recorded in */
  primarySource?: boolean;
  /* Indicates the source of a secondarily reported record */
  reportOrigin?: CodeableConcept;
  /* Vaccine product administered */
  vaccineCode: CodeableConcept;
  /* Amount of vaccine administered */
  doseQuantity?: Quantity;
  _lotNumber?: Element;
  protocolApplied?: {
    /* Recommended number of doses for immunity */
    seriesDoses?: {
      positiveInt?: positiveInt;
      _string?: Element;
      string?: string;
      _positiveInt?: Element;
    };
    /* Name of vaccine series */
    series?: string;
    /* Who is responsible for publishing the recommendations */
    authority?: Reference<'Organization'>;
    targetDisease?: CodeableConcept;
    /* Dose number within series */
    doseNumber?: {
      string?: string;
      _positiveInt?: Element;
      positiveInt?: positiveInt;
      _string?: Element;
    };
    _series?: Element;
  };
  /* Who was immunized */
  patient: Reference<'Patient'>;
  /* Vaccine manufacturer */
  manufacturer?: Reference<'Organization'>;
  _isSubpotent?: Element;
  /* Where immunization occurred */
  location?: Reference<'Location'>;
  programEligibility?: CodeableConcept;
  _expirationDate?: Element;
  reasonReference?: Array<Reference<'DiagnosticReport' | 'Observation' | 'Condition'>>;
  identifier?: Identifier;
  _primarySource?: Element;
  _status?: Element;
  /* Reason not done */
  statusReason?: CodeableConcept;
  reasonCode?: CodeableConcept;
  /* Encounter immunization was part of */
  encounter?: Reference<'Encounter'>;
  /* completed | entered-in-error | not-done */
  status: 'completed' | 'entered-in-error' | 'not-done' | 'IMMUNE' | 'MEDPREC' | 'OSTOCK' | 'PATOBJ';
  /* When the immunization was first captured in the subject's record */
  recorded?: dateTime;
  _recorded?: Element;
  /* Body site vaccine  was administered */
  site?: CodeableConcept;
  /* Vaccine expiration date */
  expirationDate?: date;
  reaction?: {
    /* When reaction started */
    date?: dateTime;
    _date?: Element;
    /* Indicates self-reported reaction */
    reported?: boolean;
    /* Additional information on reaction */
    detail?: Reference<'Observation'>;
    _reported?: Element;
  };
  /* Vaccine lot number */
  lotNumber?: string;
  subpotentReason?: CodeableConcept;
  /* Funding source for the vaccine */
  fundingSource?: CodeableConcept;
  education?: {
    _reference?: Element;
    /* Educational material document identifier */
    documentType?: string;
    _publicationDate?: Element;
    /* Educational material presentation date */
    presentationDate?: dateTime;
    _documentType?: Element;
    /* Educational material reference pointer */
    reference?: uri;
    /* Educational material publication date */
    publicationDate?: dateTime;
    _presentationDate?: Element;
  };
}

export type RPCgetLocation = {
  method: 'relatient.master-data/get-location';
  params: {
    [key: string]: any;
  };
};
export interface ContactPoint extends Element {
  /* home | work | temp | old | mobile - purpose of this contact point */
  use?: 'official' | 'home' | 'mobile' | 'old' | 'temp' | 'work';
  _system?: Element;
  /* phone | fax | email | pager | url | sms | other */
  system?: 'email' | 'fax' | 'other' | 'pager' | 'phone' | 'sms' | 'url';
  _value?: Element;
  _rank?: Element;
  /* The actual contact point details */
  value?: string;
  /* Time period when the contact point was/is in use */
  period?: Period;
  _use?: Element;
  /* Specify preferred order of use (1 = highest) */
  rank?: positiveInt;
}

export type RPCprocessProviderRule = {
  method: 'relatient.rule-engine-v2/process-provider-rule';
  params: {
    [key: string]: any;
  };
};
export type RPCsearch = {
  method: 'rpc.elastic/search';
  params: {
    [key: string]: any;
  };
};
export type RPCdeleteRule = {
  method: 'relatient.rule-engine-v2/delete-rule';
  params: {
    [key: string]: any;
  };
};
/* A list is a curated collection of resources. */
export interface List extends DomainResource, Resource<'List'> {
  /* Why list is empty */
  emptyReason?: 'closed' | 'nilknown' | 'notasked' | 'notstarted' | 'unavailable' | 'withheld';
  /* If all resources have the same subject */
  subject?: Reference<'Device' | 'Group' | 'Patient' | 'Location'>;
  _mode?: Element;
  /* current | retired | entered-in-error */
  status: 'current' | 'entered-in-error' | 'retired';
  /* Context in which list created */
  encounter?: Reference<'Encounter'>;
  _title?: Element;
  _status?: Element;
  /* Who and/or what defined the list contents (aka Author) */
  source?: Reference<'Patient' | 'PractitionerRole' | 'Device' | 'Practitioner'>;
  entry?: {
    _deleted?: Element;
    /* If this item is actually marked as deleted */
    deleted?: boolean;
    /* Status/Workflow information about this item */
    flag?: CodeableConcept;
    /* Actual entry */
    item: Reference<'Reference'>;
    /* When item added to list */
    date?: dateTime;
    _date?: Element;
  };
  /* working | snapshot | changes */
  mode: 'changes' | 'snapshot' | 'working';
  note?: Annotation;
  /* Descriptive name for the list */
  title?: string;
  identifier?: Identifier;
  /* What the purpose of this list is */
  code?: CodeableConcept;
  /* What order the list has */
  orderedBy?: 'alphabetic' | 'category' | 'entry-date' | 'event-date' | 'patient' | 'priority' | 'system' | 'user';
  /* When the list was prepared */
  date?: dateTime;
  _date?: Element;
}

/* Base StructureDefinition for Element Type: Base definition for all elements in a resource. */
export interface Element {
  /* Unique id for inter-element referencing */
  id?: string;
  _id?: any;
  extension?: Extension;
}

/* Base StructureDefinition for Narrative Type: A human-readable summary of the resource conveying the essential clinical and business information for the resource. */
export interface Narrative extends Element {
  /* Limited xhtml content */
  div: xhtml;
  _div?: Element;
  _status?: Element;
  /* generated | extensions | additional | empty */
  status: 'additional' | 'empty' | 'extensions' | 'generated';
}

/* Identifies how the ElementDefinition data type is used when it appears within a data element */
export interface ElementDefinition extends BackboneElement {
  /* Name for this particular element (in a set of slices) */
  sliceName?: string;
  'type'?: {
    _code?: Element;
    _targetProfile?: Element;
    _versioning?: Element;
    targetProfile?: canonical;
    _aggregation?: Element;
    _profile?: Element;
    /* Data type or Resource (reference to definition) */
    code: uri;
    /* either | independent | specific */
    versioning?: 'either' | 'independent' | 'specific';
    aggregation?: code;
    profile?: canonical;
  };
  _isSummary?: Element;
  slicing?: {
    /* closed | open | openAtEnd */
    rules: 'closed' | 'open' | 'openAtEnd';
    /* Text description of how slicing works (or not) */
    description?: string;
    discriminator?: {
      _type?: Element;
      _path?: Element;
      /* value | exists | pattern | type | profile */
      'type': 'exists' | 'pattern' | 'profile' | 'type' | 'value';
      /* Path to element value */
      path: string;
    };
    /* If elements must be in same order as slices */
    ordered?: boolean;
    _description?: Element;
    _ordered?: Element;
    _rules?: Element;
  };
  _maxLength?: Element;
  /* Base definition information for tools */
  base?: {
    _path?: Element;
    /* Max cardinality of the base element */
    max: string;
    _min?: Element;
    /* Min cardinality of the base element */
    min: unsignedInt;
    /* Path that identifies the base element */
    path: string;
    _max?: Element;
  };
  /* ValueSet details if this is coded */
  binding?: {
    /* required | extensible | preferred | example */
    strength: 'example' | 'extensible' | 'preferred' | 'required';
    _strength?: Element;
    /* Source of value set */
    valueSet?: canonical;
    _valueSet?: Element;
    /* Human explanation of the value set */
    description?: string;
    _description?: Element;
  };
  defaultValue?: {
    integer?: integer;
    Attachment?: Attachment;
    _canonical?: Element;
    url?: url;
    _markdown?: Element;
    boolean?: boolean;
    _code?: Element;
    RelatedArtifact?: RelatedArtifact;
    Reference?: Reference<'Reference'>;
    ParameterDefinition?: ParameterDefinition;
    _dateTime?: Element;
    Age?: Age;
    Range?: Range;
    _instant?: Element;
    _unsignedInt?: Element;
    positiveInt?: positiveInt;
    unsignedInt?: unsignedInt;
    Annotation?: Annotation;
    code?: code;
    Signature?: Signature;
    oid?: oid;
    Money?: Money;
    _time?: Element;
    uuid?: uuid;
    _decimal?: Element;
    TriggerDefinition?: TriggerDefinition;
    Ratio?: Ratio;
    _boolean?: Element;
    _url?: Element;
    uri?: uri;
    _uuid?: Element;
    base64Binary?: base64Binary;
    id?: id;
    date?: date;
    Distance?: Distance;
    Count?: Count;
    decimal?: decimal;
    CodeableConcept?: CodeableConcept;
    _integer?: Element;
    dateTime?: dateTime;
    Address?: Address;
    _base64Binary?: Element;
    DataRequirement?: DataRequirement;
    SampledData?: SampledData;
    _string?: Element;
    Expression?: Expression;
    _positiveInt?: Element;
    ContactPoint?: ContactPoint;
    time?: time;
    _id?: Element;
    instant?: instant;
    ContactDetail?: ContactDetail;
    Quantity?: Quantity;
    Identifier?: Identifier;
    canonical?: canonical;
    Coding?: Coding;
    UsageContext?: UsageContext;
    _uri?: Element;
    string?: string;
    Period?: Period;
    Timing?: Timing;
    Contributor?: Contributor;
    Dosage?: Dosage;
    Meta?: Meta;
    _date?: Element;
    Duration?: Duration;
    _oid?: Element;
    markdown?: markdown;
    HumanName?: HumanName;
  };
  example?: {
    /* Describes the purpose of this example */
    label: string;
    _label?: Element;
    /* Value of Example (one of allowed types) */
    value?: {
      _boolean?: Element;
      ParameterDefinition?: ParameterDefinition;
      _oid?: Element;
      code?: code;
      Count?: Count;
      _date?: Element;
      _base64Binary?: Element;
      _markdown?: Element;
      markdown?: markdown;
      dateTime?: dateTime;
      positiveInt?: positiveInt;
      _code?: Element;
      boolean?: boolean;
      Dosage?: Dosage;
      _uuid?: Element;
      Ratio?: Ratio;
      oid?: oid;
      Money?: Money;
      instant?: instant;
      Age?: Age;
      Reference?: Reference<'Reference'>;
      _integer?: Element;
      unsignedInt?: unsignedInt;
      DataRequirement?: DataRequirement;
      date?: date;
      _instant?: Element;
      CodeableConcept?: CodeableConcept;
      id?: id;
      base64Binary?: base64Binary;
      TriggerDefinition?: TriggerDefinition;
      UsageContext?: UsageContext;
      Contributor?: Contributor;
      integer?: integer;
      Expression?: Expression;
      Attachment?: Attachment;
      RelatedArtifact?: RelatedArtifact;
      _positiveInt?: Element;
      time?: time;
      uri?: uri;
      Address?: Address;
      Period?: Period;
      _canonical?: Element;
      ContactPoint?: ContactPoint;
      Quantity?: Quantity;
      _dateTime?: Element;
      _string?: Element;
      _time?: Element;
      Coding?: Coding;
      _url?: Element;
      Range?: Range;
      Signature?: Signature;
      _id?: Element;
      string?: string;
      url?: url;
      Annotation?: Annotation;
      _unsignedInt?: Element;
      Distance?: Distance;
      Timing?: Timing;
      Duration?: Duration;
      canonical?: canonical;
      _decimal?: Element;
      decimal?: decimal;
      _uri?: Element;
      SampledData?: SampledData;
      HumanName?: HumanName;
      uuid?: uuid;
      Meta?: Meta;
      ContactDetail?: ContactDetail;
      Identifier?: Identifier;
    };
  };
  _alias?: Element;
  isModifier?: boolean;
  _representation?: Element;
  /* Why this resource has been created */
  requirements?: markdown;
  isSummary?: boolean;
  /* If this slice definition constrains an inherited slice definition (or not) */
  sliceIsConstraining?: boolean;
  code?: Coding;
  /* Path of the element in the hierarchy of elements */
  path: string;
  /* If the element must be supported */
  mustSupport?: boolean;
  _isModifierReason?: Element;
  /* Full formal definition as narrative text */
  definition?: markdown;
  _contentReference?: Element;
  constraint?: {
    _key?: Element;
    _human?: Element;
    /* Why this constraint is necessary or appropriate */
    requirements?: string;
    /* error | warning */
    severity: 'error' | 'warning';
    _requirements?: Element;
    /* Target of 'condition' reference above */
    key: id;
    /* Reference to original source of constraint */
    source?: canonical;
    _xpath?: Element;
    _severity?: Element;
    _expression?: Element;
    /* FHIRPath expression of constraint */
    expression?: string;
    /* Human description of constraint */
    human: string;
    /* XPath expression of constraint */
    xpath?: string;
    _source?: Element;
  };
  /* Minimum Cardinality */
  min?: unsignedInt;
  /* What the order of the elements means */
  orderMeaning?: string;
  _short?: Element;
  /* Name for element to display with or prompt for element */
  label?: string;
  _definition?: Element;
  /* Maximum Allowed Value (for some types) */
  maxValue?: {
    positiveInt?: positiveInt;
    _dateTime?: Element;
    time?: time;
    unsignedInt?: unsignedInt;
    _date?: Element;
    _time?: Element;
    _instant?: Element;
    _decimal?: Element;
    integer?: integer;
    decimal?: decimal;
    date?: date;
    _positiveInt?: Element;
    _unsignedInt?: Element;
    dateTime?: dateTime;
    Quantity?: Quantity;
    _integer?: Element;
    instant?: instant;
  };
  _label?: Element;
  _condition?: Element;
  condition?: id;
  _mustSupport?: Element;
  fixed?: {
    _unsignedInt?: Element;
    Duration?: Duration;
    url?: url;
    _decimal?: Element;
    positiveInt?: positiveInt;
    _time?: Element;
    dateTime?: dateTime;
    Signature?: Signature;
    _integer?: Element;
    ParameterDefinition?: ParameterDefinition;
    oid?: oid;
    Expression?: Expression;
    Dosage?: Dosage;
    TriggerDefinition?: TriggerDefinition;
    base64Binary?: base64Binary;
    integer?: integer;
    instant?: instant;
    unsignedInt?: unsignedInt;
    code?: code;
    _string?: Element;
    RelatedArtifact?: RelatedArtifact;
    Coding?: Coding;
    Count?: Count;
    UsageContext?: UsageContext;
    _code?: Element;
    _url?: Element;
    _positiveInt?: Element;
    canonical?: canonical;
    Quantity?: Quantity;
    Range?: Range;
    Timing?: Timing;
    _base64Binary?: Element;
    Period?: Period;
    _canonical?: Element;
    _uuid?: Element;
    Distance?: Distance;
    ContactPoint?: ContactPoint;
    Address?: Address;
    HumanName?: HumanName;
    _date?: Element;
    decimal?: decimal;
    Annotation?: Annotation;
    Contributor?: Contributor;
    CodeableConcept?: CodeableConcept;
    Identifier?: Identifier;
    id?: id;
    ContactDetail?: ContactDetail;
    Meta?: Meta;
    _markdown?: Element;
    _instant?: Element;
    string?: string;
    _uri?: Element;
    _dateTime?: Element;
    Money?: Money;
    Age?: Age;
    _boolean?: Element;
    _id?: Element;
    Attachment?: Attachment;
    SampledData?: SampledData;
    DataRequirement?: DataRequirement;
    date?: date;
    time?: time;
    _oid?: Element;
    Reference?: Reference<'Reference'>;
    uri?: uri;
    markdown?: markdown;
    uuid?: uuid;
    Ratio?: Ratio;
    boolean?: boolean;
  };
  mapping?: {
    _comment?: Element;
    _identity?: Element;
    /* Computable language of mapping */
    language?: 'application/hl7-cda+xml';
    /* Details of the mapping */
    map: string;
    /* Reference to mapping declaration */
    identity: id;
    _language?: Element;
    /* Comments about the mapping or its use */
    comment?: string;
    _map?: Element;
  };
  _sliceIsConstraining?: Element;
  _max?: Element;
  _requirements?: Element;
  _orderMeaning?: Element;
  _comment?: Element;
  contentReference?: uri;
  /* Reason that this element is marked as a modifier */
  isModifierReason?: string;
  /* Maximum Cardinality (a number or *) */
  max?: string;
  meaningWhenMissing?: markdown;
  representation?: code;
  /* Comments about the use of this element */
  comment?: markdown;
  /* Minimum Allowed Value (for some types) */
  minValue?: {
    instant?: instant;
    integer?: integer;
    _integer?: Element;
    _positiveInt?: Element;
    _unsignedInt?: Element;
    positiveInt?: positiveInt;
    _instant?: Element;
    Quantity?: Quantity;
    date?: date;
    decimal?: decimal;
    time?: time;
    _date?: Element;
    _decimal?: Element;
    _time?: Element;
    dateTime?: dateTime;
    _dateTime?: Element;
    unsignedInt?: unsignedInt;
  };
  _path?: Element;
  /* Max length for strings */
  maxLength?: integer;
  pattern?: {
    _id?: Element;
    canonical?: canonical;
    Attachment?: Attachment;
    Meta?: Meta;
    Distance?: Distance;
    boolean?: boolean;
    unsignedInt?: unsignedInt;
    dateTime?: dateTime;
    Count?: Count;
    _base64Binary?: Element;
    SampledData?: SampledData;
    Annotation?: Annotation;
    Duration?: Duration;
    _dateTime?: Element;
    DataRequirement?: DataRequirement;
    _code?: Element;
    HumanName?: HumanName;
    Expression?: Expression;
    Coding?: Coding;
    instant?: instant;
    _canonical?: Element;
    _uri?: Element;
    integer?: integer;
    _url?: Element;
    Address?: Address;
    _boolean?: Element;
    ParameterDefinition?: ParameterDefinition;
    decimal?: decimal;
    markdown?: markdown;
    _time?: Element;
    time?: time;
    base64Binary?: base64Binary;
    TriggerDefinition?: TriggerDefinition;
    Reference?: Reference<'Reference'>;
    RelatedArtifact?: RelatedArtifact;
    ContactDetail?: ContactDetail;
    url?: url;
    Dosage?: Dosage;
    UsageContext?: UsageContext;
    Range?: Range;
    Age?: Age;
    ContactPoint?: ContactPoint;
    Timing?: Timing;
    _oid?: Element;
    uri?: uri;
    date?: date;
    Period?: Period;
    _instant?: Element;
    Identifier?: Identifier;
    Signature?: Signature;
    _positiveInt?: Element;
    _string?: Element;
    _unsignedInt?: Element;
    Contributor?: Contributor;
    oid?: oid;
    code?: code;
    uuid?: uuid;
    Ratio?: Ratio;
    _integer?: Element;
    CodeableConcept?: CodeableConcept;
    _date?: Element;
    _markdown?: Element;
    positiveInt?: positiveInt;
    string?: string;
    Quantity?: Quantity;
    Money?: Money;
    _decimal?: Element;
    _uuid?: Element;
    id?: id;
  };
  _meaningWhenMissing?: Element;
  alias?: string;
  _min?: Element;
  short?: string;
  _sliceName?: Element;
  _isModifier?: Element;
}

/* Broadcast campaign */
export interface Broadcast extends Resource<'Broadcast'> {
  name: string;
  timeRange?: {
    start: string;
    end: string;
  };
  organization: Reference<'Organization'>;
  sendDate: dateTime;
  messageTemplates: Array<Reference<'MessageTemplate'>>;
  modalities: any;
  audienceGroups: Array<Reference<'AudienceGroup'>>;
  /* Store technical information */
  metadata?: {
    isTest?: boolean;
    conductorWorkflowId?: string;
    status?: 'complete' | 'in-progress' | 'skip' | 'fail';
    skipReason?: string;
  };
}

export interface Role extends Resource<'Role'> {
  name: string;
}

export interface PlanDefinition extends DomainResource, Resource<'PlanDefinition'> {
  _status?: Element;
  _library?: Element;
  _purpose?: Element;
  _title?: Element;
  /* Business version of the plan definition */
  version?: string;
  _description?: Element;
  _publisher?: Element;
  /* When the plan definition was last reviewed */
  lastReviewDate?: date;
  /* Canonical identifier for this plan definition, represented as a URI (globally unique) */
  url?: uri;
  _version?: Element;
  /* Type of individual the plan definition is focused on */
  subject?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Group'>;
  };
  /* When the plan definition was approved by publisher */
  approvalDate?: date;
  contact?: ContactDetail;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Natural language description of the plan definition */
  description?: markdown;
  author?: ContactDetail;
  _copyright?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* When the plan definition is expected to be used */
  effectivePeriod?: Period;
  /* Why this plan definition is defined */
  purpose?: markdown;
  relatedArtifact?: RelatedArtifact;
  editor?: ContactDetail;
  reviewer?: ContactDetail;
  goal?: {
    addresses?: CodeableConcept;
    documentation?: RelatedArtifact;
    /* When goal pursuit begins */
    start?: CodeableConcept;
    /* high-priority | medium-priority | low-priority */
    priority?: 'high-priority' | 'low-priority' | 'medium-priority';
    target?: {
      /* The parameter whose value is to be tracked */
      measure?: CodeableConcept;
      /* Reach goal within */
      due?: Duration;
      /* The target value to be achieved */
      detail?: {
        CodeableConcept?: CodeableConcept;
        Quantity?: Quantity;
        Range?: Range;
      };
    };
    /* E.g. Treatment, dietary, behavioral */
    category?: CodeableConcept;
    /* Code or text describing the goal */
    description: CodeableConcept;
  };
  _name?: Element;
  _lastReviewDate?: Element;
  /* Date last changed */
  date?: dateTime;
  _approvalDate?: Element;
  jurisdiction?: CodeableConcept;
  /* Subordinate title of the plan definition */
  subtitle?: string;
  identifier?: Identifier;
  _date?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* order-set | clinical-protocol | eca-rule | workflow-definition */
  'type'?: CodeableConcept;
  title?: string;
  library?: canonical;
  _usage?: Element;
  endorser?: ContactDetail;
  /* Describes the clinical usage of the plan */
  usage?: string;
  status?: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  topic?: CodeableConcept;
  _url?: Element;
  _experimental?: Element;
  /* Name for this plan definition (computer friendly) */
  name?: string;
  useContext?: UsageContext;
  _subtitle?: Element;
  action?: {
    _prefix?: Element;
    _transform?: Element;
    /* must | could | must-unless-documented */
    requiredBehavior?: 'could' | 'must' | 'must-unless-documented';
    /* yes | no */
    precheckBehavior?: 'no' | 'yes';
    _title?: Element;
    _cardinalityBehavior?: Element;
    goalId?: id;
    input?: DataRequirement;
    _groupingBehavior?: Element;
    /* create | update | remove | fire-event */
    'type'?: CodeableConcept;
    trigger?: TriggerDefinition;
    /* When the action should take place */
    timing?: {
      dateTime?: dateTime;
      Period?: Period;
      Duration?: Duration;
      Range?: Range;
      Age?: Age;
      Timing?: Timing;
      _dateTime?: Element;
    };
    _textEquivalent?: Element;
    condition?: {
      /* applicability | start | stop */
      kind: 'applicability' | 'start' | 'stop';
      /* Boolean-valued expression */
      expression?: Expression;
      _kind?: Element;
    };
    code?: CodeableConcept;
    /* Description of the activity to be performed */
    definition?: {
      _canonical?: Element;
      canonical?: canonical;
      _uri?: Element;
      uri?: uri;
    };
    _priority?: Element;
    _requiredBehavior?: Element;
    action?: any;
    output?: DataRequirement;
    dynamicValue?: {
      /* The path to the element to be set dynamically */
      path?: string;
      _path?: Element;
      /* An expression that provides the dynamic value for the customization */
      expression?: Expression;
    };
    /* single | multiple */
    cardinalityBehavior?: 'multiple' | 'single';
    reason?: CodeableConcept;
    relatedAction?: {
      /* before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end */
      relationship:
        | 'after'
        | 'after-end'
        | 'after-start'
        | 'before'
        | 'before-end'
        | 'before-start'
        | 'concurrent'
        | 'concurrent-with-end'
        | 'concurrent-with-start';
      _actionId?: Element;
      _relationship?: Element;
      /* What action is this related to */
      actionId: id;
      /* Time offset for the relationship */
      offset?: {
        Duration?: Duration;
        Range?: Range;
      };
    };
    /* Brief description of the action */
    description?: string;
    participant?: {
      /* E.g. Nurse, Surgeon, Parent */
      role?: CodeableConcept;
      /* patient | practitioner | related-person | device */
      'type': 'device' | 'patient' | 'practitioner' | 'related-person';
      _type?: Element;
    };
    /* User-visible title */
    title?: string;
    /* Transform to apply the template */
    transform?: canonical;
    /* Static text equivalent of the action, used if the dynamic aspects cannot be interpreted by the receiving system */
    textEquivalent?: string;
    _goalId?: Element;
    _selectionBehavior?: Element;
    /* User-visible prefix for the action (e.g. 1. or A.) */
    prefix?: string;
    /* Type of individual the action is focused on */
    subject?: {
      Reference?: Reference<'Group'>;
      CodeableConcept?: CodeableConcept;
    };
    documentation?: RelatedArtifact;
    _description?: Element;
    /* visual-group | logical-group | sentence-group */
    groupingBehavior?: 'logical-group' | 'sentence-group' | 'visual-group';
    /* any | all | all-or-none | exactly-one | at-most-one | one-or-more */
    selectionBehavior?: 'all' | 'all-or-none' | 'any' | 'at-most-one' | 'exactly-one' | 'one-or-more';
    /* routine | urgent | asap | stat */
    priority?: 'asap' | 'routine' | 'stat' | 'urgent';
    _precheckBehavior?: Element;
  };
}

/* Legally enforceable, formally recorded unilateral or bilateral directive i.e., a policy or agreement. */
export interface Contract extends DomainResource, Resource<'Contract'> {
  domain?: Array<Reference<'Location'>>;
  signer?: {
    /* Contract Signatory Role */
    'type':
      | 'AFFL'
      | 'AGNT'
      | 'AMENDER'
      | 'ASSIGNED'
      | 'AUT'
      | 'AUTHN'
      | 'CIT'
      | 'CLAIMANT'
      | 'COAUTH'
      | 'CONSENTER'
      | 'CONSWIT'
      | 'CONT'
      | 'COPART'
      | 'COVPTY'
      | 'DELEGATEE'
      | 'delegator'
      | 'DEPEND'
      | 'DPOWATT'
      | 'EMGCON'
      | 'EVTWIT'
      | 'EXCEST'
      | 'GRANTEE'
      | 'GRANTOR'
      | 'GUADLTM'
      | 'GUAR'
      | 'GUARD'
      | 'HPOWATT'
      | 'HPROV'
      | 'INF'
      | 'INSBJ'
      | 'INTPRT'
      | 'LEGAUTHN'
      | 'NMDINS'
      | 'NOK'
      | 'NOTARY'
      | 'PAT'
      | 'POWATT'
      | 'PRIMAUTH'
      | 'PRIRECIP'
      | 'RECIP'
      | 'RESPRSN'
      | 'REVIEWER'
      | 'SOURCE'
      | 'SPOWATT'
      | 'TRANS'
      | 'VALID'
      | 'VERF'
      | 'WIT';
    signature: Signature;
    /* Contract Signatory Party */
    party: Reference<'PractitionerRole' | 'RelatedPerson' | 'Organization' | 'Patient' | 'Practitioner'>;
  };
  /* External Contract Definition */
  instantiatesUri?: uri;
  /* Source Contract Definition */
  instantiatesCanonical?: Reference<'Contract'>;
  _title?: Element;
  /* Human Friendly name */
  title?: string;
  /* Focus of contract interest */
  topic?: {
    Reference?: Reference<'Reference'>;
    CodeableConcept?: CodeableConcept;
  };
  _issued?: Element;
  legal?: {
    /* Contract Legal Text */
    content?: {
      Reference?: Reference<'QuestionnaireResponse' | 'Composition' | 'DocumentReference'>;
      Attachment?: Attachment;
    };
  };
  identifier?: Identifier;
  /* Legal instrument category */
  'type'?: CodeableConcept;
  /* Basal definition */
  url?: uri;
  _name?: Element;
  /* amended | appended | cancelled | disputed | entered-in-error | executable | executed | negotiable | offered | policy | rejected | renewed | revoked | resolved | terminated */
  status?:
    | 'amended'
    | 'appended'
    | 'cancelled'
    | 'disputed'
    | 'entered-in-error'
    | 'executable'
    | 'executed'
    | 'negotiable'
    | 'offered'
    | 'policy'
    | 'rejected'
    | 'renewed'
    | 'resolved'
    | 'revoked'
    | 'terminated';
  term?: {
    /* Contract Term Type or Form */
    'type'?: CodeableConcept;
    /* Contract Term Effective Time */
    applies?: Period;
    /* Contract Term Issue Date Time */
    issued?: dateTime;
    _text?: Element;
    /* Context of the Contract term */
    offer?: {
      /* Negotiable offer asset */
      topic?: Reference<'Reference'>;
      securityLabelNumber?: unsignedInt;
      /* Contract Offer Type or Form */
      'type'?: CodeableConcept;
      party?: {
        /* Participant engagement type */
        role: CodeableConcept;
        reference: Array<
          Reference<
            'Group' | 'Patient' | 'Device' | 'Organization' | 'PractitionerRole' | 'RelatedPerson' | 'Practitioner'
          >
        >;
      };
      _linkId?: Element;
      linkId?: string;
      identifier?: Identifier;
      _text?: Element;
      answer?: {
        /* The actual answer response */
        value?: {
          string?: string;
          boolean?: boolean;
          Attachment?: Attachment;
          Quantity?: Quantity;
          _date?: Element;
          Reference?: Reference<'Reference'>;
          _uri?: Element;
          decimal?: decimal;
          _boolean?: Element;
          time?: time;
          _decimal?: Element;
          _dateTime?: Element;
          integer?: integer;
          date?: date;
          Coding?: Coding;
          _integer?: Element;
          _string?: Element;
          _time?: Element;
          dateTime?: dateTime;
          uri?: uri;
        };
      };
      /* Human readable offer text */
      text?: string;
      decisionMode?: CodeableConcept;
      /* Accepting party choice */
      decision?: CodeableConcept;
      _securityLabelNumber?: Element;
    };
    /* Contract Term Number */
    identifier?: Identifier;
    asset?: {
      'type'?: CodeableConcept;
      /* Range of asset */
      scope?: CodeableConcept;
      linkId?: string;
      /* Kinship of the asset */
      relationship?: Coding;
      /* Asset clause or question text */
      text?: string;
      usePeriod?: Period;
      _condition?: Element;
      /* Quality desctiption of asset */
      condition?: string;
      answer?: any;
      context?: {
        code?: CodeableConcept;
        _text?: Element;
        /* Context description */
        text?: string;
        /* Creator,custodian or owner */
        reference?: Reference<'Reference'>;
      };
      _linkId?: Element;
      _text?: Element;
      period?: Period;
      periodType?: CodeableConcept;
      securityLabelNumber?: unsignedInt;
      subtype?: CodeableConcept;
      _securityLabelNumber?: Element;
      valuedItem?: {
        _linkId?: Element;
        /* Contract Valued Item fee, charge, or cost */
        unitPrice?: Money;
        /* Contract Valued Item Difficulty Scaling Factor */
        points?: decimal;
        _points?: Element;
        /* Total Contract Valued Item Value */
        net?: Money;
        /* Who will make payment */
        responsible?: Reference<'Patient' | 'RelatedPerson' | 'PractitionerRole' | 'Organization' | 'Practitioner'>;
        /* Contract Valued Item Effective Tiem */
        effectiveTime?: dateTime;
        /* Contract Valued Item Type */
        entity?: {
          Reference?: Reference<'Reference'>;
          CodeableConcept?: CodeableConcept;
        };
        _payment?: Element;
        _effectiveTime?: Element;
        /* Contract Valued Item Price Scaling Factor */
        factor?: decimal;
        /* Who will receive payment */
        recipient?: Reference<'PractitionerRole' | 'RelatedPerson' | 'Practitioner' | 'Patient' | 'Organization'>;
        _paymentDate?: Element;
        linkId?: string;
        securityLabelNumber?: unsignedInt;
        _securityLabelNumber?: Element;
        /* Terms of valuation */
        payment?: string;
        _factor?: Element;
        /* Contract Valued Item Number */
        identifier?: Identifier;
        /* When payment is due */
        paymentDate?: dateTime;
        /* Count of Contract Valued Items */
        quantity?: Quantity;
      };
      typeReference?: Array<Reference<'Reference'>>;
    };
    group?: any;
    action?: {
      /* When action happens */
      occurrence?: {
        Period?: Period;
        Timing?: Timing;
        _dateTime?: Element;
        dateTime?: dateTime;
      };
      reasonReference?: Array<
        Reference<
          | 'DocumentReference'
          | 'Condition'
          | 'Observation'
          | 'DiagnosticReport'
          | 'QuestionnaireResponse'
          | 'Questionnaire'
        >
      >;
      linkId?: string;
      requester?: Array<
        Reference<
          'Device' | 'Organization' | 'RelatedPerson' | 'PractitionerRole' | 'Patient' | 'Practitioner' | 'Group'
        >
      >;
      _securityLabelNumber?: Element;
      /* Actor that wil execute (or not) the action */
      performer?: Reference<
        | 'Organization'
        | 'RelatedPerson'
        | 'CareTeam'
        | 'PractitionerRole'
        | 'Patient'
        | 'Substance'
        | 'Location'
        | 'Device'
        | 'Practitioner'
      >;
      contextLinkId?: string;
      /* Competency of the performer */
      performerRole?: CodeableConcept;
      note?: Annotation;
      reasonCode?: CodeableConcept;
      requesterLinkId?: string;
      /* True if the term prohibits the  action */
      doNotPerform?: boolean;
      performerLinkId?: string;
      _reason?: Element;
      reason?: string;
      /* State of the action */
      status: CodeableConcept;
      performerType?: CodeableConcept;
      /* Purpose for the Contract Term Action */
      intent: CodeableConcept;
      securityLabelNumber?: unsignedInt;
      _requesterLinkId?: Element;
      _performerLinkId?: Element;
      _linkId?: Element;
      _reasonLinkId?: Element;
      subject?: {
        /* Role type of the agent */
        role?: CodeableConcept;
        reference: Array<
          Reference<
            'PractitionerRole' | 'Patient' | 'Organization' | 'Device' | 'Practitioner' | 'RelatedPerson' | 'Group'
          >
        >;
      };
      _contextLinkId?: Element;
      reasonLinkId?: string;
      /* Episode associated with action */
      context?: Reference<'EpisodeOfCare' | 'Encounter'>;
      /* Type or form of the action */
      'type': CodeableConcept;
      _doNotPerform?: Element;
    };
    /* Contract Term Type specific classification */
    subType?: CodeableConcept;
    _issued?: Element;
    /* Term Statement */
    text?: string;
    /* Term Concern */
    topic?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Reference'>;
    };
    securityLabel?: {
      control?: Coding;
      /* Confidentiality Protection */
      classification: Coding;
      number?: unsignedInt;
      _number?: Element;
      category?: Coding;
    };
  };
  authority?: Array<Reference<'Organization'>>;
  _status?: Element;
  /* Binding Contract */
  legallyBinding?: {
    Attachment?: Attachment;
    Reference?: Reference<'DocumentReference' | 'QuestionnaireResponse' | 'Composition' | 'Contract'>;
  };
  _instantiatesUri?: Element;
  subType?: CodeableConcept;
  _url?: Element;
  /* Subordinate Friendly name */
  subtitle?: string;
  /* Computer friendly designation */
  name?: string;
  /* When this Contract was issued */
  issued?: dateTime;
  site?: Array<Reference<'Location'>>;
  /* Business edition */
  version?: string;
  /* Range of Legal Concerns */
  scope?: CodeableConcept;
  /* Contract cessation cause */
  expirationType?: CodeableConcept;
  /* Negotiation status */
  legalState?: CodeableConcept;
  supportingInfo?: Array<Reference<'Reference'>>;
  _subtitle?: Element;
  /* Source of Contract */
  author?: Reference<'PractitionerRole' | 'Patient' | 'Organization' | 'Practitioner'>;
  /* Content derived from the basal information */
  contentDerivative?: CodeableConcept;
  rule?: {
    /* Computable Contract Rules */
    content?: {
      Reference?: Reference<'DocumentReference'>;
      Attachment?: Attachment;
    };
  };
  relevantHistory?: Array<Reference<'Provenance'>>;
  /* Contract precursor content */
  contentDefinition?: {
    /* Detailed Content Type Definition */
    subType?: CodeableConcept;
    /* Content structure and use */
    'type': CodeableConcept;
    /* Publication Ownership */
    copyright?: markdown;
    _copyright?: Element;
    /* When published */
    publicationDate?: dateTime;
    _publicationDate?: Element;
    /* Publisher Entity */
    publisher?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
    _publicationStatus?: Element;
    /* amended | appended | cancelled | disputed | entered-in-error | executable | executed | negotiable | offered | policy | rejected | renewed | revoked | resolved | terminated */
    publicationStatus:
      | 'amended'
      | 'appended'
      | 'cancelled'
      | 'disputed'
      | 'entered-in-error'
      | 'executable'
      | 'executed'
      | 'negotiable'
      | 'offered'
      | 'policy'
      | 'rejected'
      | 'renewed'
      | 'resolved'
      | 'revoked'
      | 'terminated';
  };
  _version?: Element;
  alias?: string;
  /* Effective time */
  applies?: Period;
  friendly?: {
    /* Easily comprehended representation of this Contract */
    content?: {
      Reference?: Reference<'QuestionnaireResponse' | 'Composition' | 'DocumentReference'>;
      Attachment?: Attachment;
    };
  };
  subject?: Array<Reference<'Reference'>>;
  _alias?: Element;
}

/* Information about the acceptance and relative priority assigned to the goal by the patient, practitioners and other stake-holders. */
export interface goalAcceptance {
  /* agree | disagree | pending */
  status?: 'agree' | 'pending' | 'disagree';
  /* Individual whose acceptance is reflected */
  individual: Reference<'Patient' | 'RelatedPerson' | 'Practitioner'>;
  /* Priority of goal for individual */
  priority?: CodeableConcept;
}

/* A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */
export interface ConceptMap extends DomainResource, Resource<'ConceptMap'> {
  /* Canonical identifier for this concept map, represented as a URI (globally unique) */
  url?: uri;
  /* Date last changed */
  date?: dateTime;
  _publisher?: Element;
  _experimental?: Element;
  _copyright?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Why this concept map is defined */
  purpose?: markdown;
  /* Name for this concept map (human friendly) */
  title?: string;
  _purpose?: Element;
  /* The source value set that contains the concepts that are being mapped */
  source?: {
    canonical?: canonical;
    _uri?: Element;
    uri?: uri;
    _canonical?: Element;
  };
  /* Name for this concept map (computer friendly) */
  name?: string;
  _title?: Element;
  _version?: Element;
  /* The target value set which provides context for the mappings */
  target?: {
    uri?: uri;
    canonical?: canonical;
    _canonical?: Element;
    _uri?: Element;
  };
  _url?: Element;
  useContext?: UsageContext;
  /* Additional identifier for the concept map */
  identifier?: Identifier;
  contact?: ContactDetail;
  /* Business version of the concept map */
  version?: string;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  _description?: Element;
  _status?: Element;
  _date?: Element;
  jurisdiction?: CodeableConcept;
  group?: {
    /* Specific version of the  code system */
    sourceVersion?: string;
    element: {
      target?: {
        /* Display for the code */
        display?: string;
        _comment?: Element;
        /* relatedto | equivalent | equal | wider | subsumes | narrower | specializes | inexact | unmatched | disjoint */
        equivalence:
          | 'disjoint'
          | 'equal'
          | 'equivalent'
          | 'inexact'
          | 'narrower'
          | 'relatedto'
          | 'specializes'
          | 'subsumes'
          | 'unmatched'
          | 'wider';
        dependsOn?: {
          /* Code System (if necessary) */
          system?: canonical;
          _system?: Element;
          /* Reference to property mapping depends on */
          property: uri;
          /* Display for the code (if value is a code) */
          display?: string;
          /* Value of the referenced element */
          value: string;
          _property?: Element;
          _display?: Element;
          _value?: Element;
        };
        product?: any;
        _display?: Element;
        /* Code that identifies the target element */
        code?: code;
        /* Description of status/issues in mapping */
        comment?: string;
        _equivalence?: Element;
        _code?: Element;
      };
      _display?: Element;
      /* Display for the code */
      display?: string;
      /* Identifies element being mapped */
      code?: code;
      _code?: Element;
    };
    /* Target system that the concepts are to be mapped to */
    target?: uri;
    /* Source system where concepts to be mapped are defined */
    source?: uri;
    _source?: Element;
    _targetVersion?: Element;
    _sourceVersion?: Element;
    /* Specific version of the  code system */
    targetVersion?: string;
    _target?: Element;
    /* What to do when there is no mapping for the source concept */
    unmapped?: {
      /* canonical reference to an additional ConceptMap to use for mapping if the source concept is unmapped */
      url?: canonical;
      _code?: Element;
      /* Display for the code */
      display?: string;
      /* provided | fixed | other-map */
      mode: 'fixed' | 'other-map' | 'provided';
      _display?: Element;
      _mode?: Element;
      /* Fixed code when mode = fixed */
      code?: code;
      _url?: Element;
    };
  };
  /* Natural language description of the concept map */
  description?: markdown;
  _name?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
}

export type RPCcreateSession = {
  method: 'relatient.integration/create-session';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for ContactDetail Type: Specifies contact information for a person or organization. */
export interface ContactDetail extends Element {
  _name?: Element;
  /* Name of an individual to contact */
  name?: string;
  telecom?: ContactPoint;
}

/* A sample to be used for analysis. */
export interface Specimen extends DomainResource, Resource<'Specimen'> {
  /* Where the specimen came from. This may be from patient(s), from a location (e.g., the source of an environmental sample), or a sampling of a substance or a device */
  subject?: Reference<'Device' | 'Location' | 'Substance' | 'Group' | 'Patient'>;
  _receivedTime?: Element;
  note?: Annotation;
  processing?: {
    /* Indicates the treatment step  applied to the specimen */
    procedure?: CodeableConcept;
    /* Textual description of procedure */
    description?: string;
    /* Date and time of specimen processing */
    time?: {
      Period?: Period;
      _dateTime?: Element;
      dateTime?: dateTime;
    };
    additive?: Array<Reference<'Substance'>>;
    _description?: Element;
  };
  /* Collection details */
  collection?: {
    /* Who collected the specimen */
    collector?: Reference<'PractitionerRole' | 'Practitioner'>;
    /* How long it took to collect specimen */
    duration?: Duration;
    /* Technique used to perform collection */
    method?: CodeableConcept;
    /* Whether or how long patient abstained from food and/or drink */
    fastingStatus?: {
      CodeableConcept?: CodeableConcept;
      Duration?: Duration;
    };
    /* The quantity of specimen collected */
    quantity?: Quantity;
    /* Collection time */
    collected?: {
      Period?: Period;
      dateTime?: dateTime;
      _dateTime?: Element;
    };
    /* Anatomical collection site */
    bodySite?: CodeableConcept;
  };
  /* The time when specimen was received for processing */
  receivedTime?: dateTime;
  /* available | unavailable | unsatisfactory | entered-in-error */
  status?: 'available' | 'entered-in-error' | 'unavailable' | 'unsatisfactory';
  _status?: Element;
  /* Identifier assigned by the lab */
  accessionIdentifier?: Identifier;
  identifier?: Identifier;
  container?: {
    /* Quantity of specimen within container */
    specimenQuantity?: Quantity;
    _description?: Element;
    /* Container volume or size */
    capacity?: Quantity;
    /* Additive associated with container */
    additive?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Substance'>;
    };
    /* Kind of container directly associated with specimen */
    'type'?: CodeableConcept;
    identifier?: Identifier;
    /* Textual description of the container */
    description?: string;
  };
  /* Kind of material that forms the specimen */
  'type'?: CodeableConcept;
  request?: Array<Reference<'ServiceRequest'>>;
  condition?: CodeableConcept;
  parent?: Array<Reference<'Specimen'>>;
}

export interface Communication extends DomainResource, Resource<'Communication'> {
  /* Reason for current status */
  statusReason?: CodeableConcept;
  /* Focus of message */
  subject?: Reference<'Patient' | 'Group'>;
  partOf?: Array<Reference<'Reference'>>;
  _status?: Element;
  recipient?: Array<
    Reference<
      | 'RelatedPerson'
      | 'Group'
      | 'Organization'
      | 'HealthcareService'
      | 'Device'
      | 'PractitionerRole'
      | 'CareTeam'
      | 'Practitioner'
      | 'Patient'
    >
  >;
  identifier?: Identifier;
  instantiatesUri?: uri;
  /* Description of the purpose/content */
  topic?: CodeableConcept;
  _sent?: Element;
  /* When sent */
  sent?: dateTime;
  /* Message sender */
  sender?: Reference<
    'Device' | 'HealthcareService' | 'PractitionerRole' | 'RelatedPerson' | 'Patient' | 'Practitioner' | 'Organization'
  >;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* When received */
  received?: dateTime;
  reasonCode?: CodeableConcept;
  category?: CodeableConcept;
  inResponseTo?: Array<Reference<'Communication'>>;
  payload?: {
    /* Message part content */
    content?: {
      _string?: Element;
      Reference?: Reference<'Reference'>;
      Attachment?: Attachment;
      string?: string;
    };
  };
  note?: Annotation;
  _priority?: Element;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  /* preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown */
  status:
    | 'completed'
    | 'entered-in-error'
    | 'in-progress'
    | 'not-done'
    | 'on-hold'
    | 'preparation'
    | 'stopped'
    | 'unknown';
  _instantiatesUri?: Element;
  medium?: CodeableConcept;
  _instantiatesCanonical?: Element;
  reasonReference?: Array<Reference<'DiagnosticReport' | 'DocumentReference' | 'Condition' | 'Observation'>>;
  about?: Array<Reference<'Reference'>>;
  _received?: Element;
  instantiatesCanonical?: canonical;
  basedOn?: Array<Reference<'Reference'>>;
}

export type RPCgetConcept = {
  method: 'relatient.terminology/get-concept';
  params: {
    [key: string]: any;
  };
};
/* Describe the undesirable effects of the medicinal product. */
export interface MedicinalProductUndesirableEffect
  extends DomainResource, Resource<'MedicinalProductUndesirableEffect'>
{
  population?: Population;
  /* Classification of the effect */
  classification?: CodeableConcept;
  /* The symptom, condition or undesirable effect */
  symptomConditionEffect?: CodeableConcept;
  subject?: Array<Reference<'MedicinalProduct' | 'Medication'>>;
  /* The frequency of occurrence of the effect */
  frequencyOfOccurrence?: CodeableConcept;
}

/* A group of related requests that can be used to capture intended activities that have inter-dependencies such as "give this medication after that one". */
export interface RequestGroup extends DomainResource, Resource<'RequestGroup'> {
  identifier?: Identifier;
  /* Created as part of */
  encounter?: Reference<'Encounter'>;
  basedOn?: Array<Reference<'Reference'>>;
  action?: {
    participant?: Array<Reference<'RelatedPerson' | 'Patient' | 'Device' | 'PractitionerRole' | 'Practitioner'>>;
    _cardinalityBehavior?: Element;
    _prefix?: Element;
    /* User-visible title */
    title?: string;
    /* create | update | remove | fire-event */
    'type'?: CodeableConcept;
    _textEquivalent?: Element;
    /* must | could | must-unless-documented */
    requiredBehavior?: 'could' | 'must' | 'must-unless-documented';
    _description?: Element;
    _priority?: Element;
    code?: CodeableConcept;
    _selectionBehavior?: Element;
    /* routine | urgent | asap | stat */
    priority?: 'asap' | 'routine' | 'stat' | 'urgent';
    /* any | all | all-or-none | exactly-one | at-most-one | one-or-more */
    selectionBehavior?: 'all' | 'all-or-none' | 'any' | 'at-most-one' | 'exactly-one' | 'one-or-more';
    /* When the action should take place */
    timing?: {
      Age?: Age;
      _dateTime?: Element;
      Range?: Range;
      Timing?: Timing;
      dateTime?: dateTime;
      Period?: Period;
      Duration?: Duration;
    };
    relatedAction?: {
      /* Time offset for the relationship */
      offset?: {
        Duration?: Duration;
        Range?: Range;
      };
      _relationship?: Element;
      _actionId?: Element;
      /* before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end */
      relationship:
        | 'after'
        | 'after-end'
        | 'after-start'
        | 'before'
        | 'before-end'
        | 'before-start'
        | 'concurrent'
        | 'concurrent-with-end'
        | 'concurrent-with-start';
      /* What action this is related to */
      actionId: id;
    };
    condition?: {
      /* Boolean-valued expression */
      expression?: Expression;
      /* applicability | start | stop */
      kind: 'applicability' | 'start' | 'stop';
      _kind?: Element;
    };
    _title?: Element;
    /* Short description of the action */
    description?: string;
    _requiredBehavior?: Element;
    /* Static text equivalent of the action, used if the dynamic aspects cannot be interpreted by the receiving system */
    textEquivalent?: string;
    _groupingBehavior?: Element;
    /* User-visible prefix for the action (e.g. 1. or A.) */
    prefix?: string;
    action?: any;
    /* single | multiple */
    cardinalityBehavior?: 'multiple' | 'single';
    /* The target of the action */
    resource?: Reference<'Reference'>;
    /* yes | no */
    precheckBehavior?: 'no' | 'yes';
    _precheckBehavior?: Element;
    documentation?: RelatedArtifact;
    /* visual-group | logical-group | sentence-group */
    groupingBehavior?: 'logical-group' | 'sentence-group' | 'visual-group';
  };
  /* proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option */
  intent:
    | 'directive'
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order';
  /* Who the request group is about */
  subject?: Reference<'Group' | 'Patient'>;
  _intent?: Element;
  /* When the request group was authored */
  authoredOn?: dateTime;
  _instantiatesCanonical?: Element;
  note?: Annotation;
  /* Device or practitioner that authored the request group */
  author?: Reference<'Device' | 'PractitionerRole' | 'Practitioner'>;
  instantiatesCanonical?: canonical;
  instantiatesUri?: uri;
  _authoredOn?: Element;
  _status?: Element;
  _instantiatesUri?: Element;
  /* What's being requested/ordered */
  code?: CodeableConcept;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  _priority?: Element;
  /* Composite request this is part of */
  groupIdentifier?: Identifier;
  reasonCode?: CodeableConcept;
  reasonReference?: Array<Reference<'DiagnosticReport' | 'Observation' | 'DocumentReference' | 'Condition'>>;
  replaces?: Array<Reference<'Reference'>>;
  /* draft | active | on-hold | revoked | completed | entered-in-error | unknown */
  status: 'active' | 'completed' | 'draft' | 'entered-in-error' | 'on-hold' | 'revoked' | 'unknown';
}

/* The Human Language of the item. */
export type language =
  | 'ar'
  | 'bn'
  | 'cs'
  | 'da'
  | 'de'
  | 'de-AT'
  | 'de-CH'
  | 'de-DE'
  | 'el'
  | 'en'
  | 'en-AU'
  | 'en-CA'
  | 'en-GB'
  | 'en-IN'
  | 'en-NZ'
  | 'en-SG'
  | 'en-US'
  | 'es'
  | 'es-AR'
  | 'es-ES'
  | 'es-UY'
  | 'fi'
  | 'fr'
  | 'fr-BE'
  | 'fr-CH'
  | 'fr-FR'
  | 'fy'
  | 'fy-NL'
  | 'hi'
  | 'hr'
  | 'it'
  | 'it-CH'
  | 'it-IT'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'nl-BE'
  | 'nl-NL'
  | 'no'
  | 'no-NO'
  | 'pa'
  | 'pl'
  | 'pt'
  | 'pt-BR'
  | 'ru'
  | 'ru-RU'
  | 'sr'
  | 'sr-RS'
  | 'sv'
  | 'sv-SE'
  | 'te'
  | 'zh'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-SG'
  | 'zh-TW';
/* An association between a patient and an organization / healthcare provider(s) during which time encounters may occur. The managing organization assumes a level of responsibility for the patient during this time. */
export interface EpisodeOfCare extends DomainResource, Resource<'EpisodeOfCare'> {
  referralRequest?: Array<Reference<'ServiceRequest'>>;
  team?: Array<Reference<'CareTeam'>>;
  identifier?: Identifier;
  /* Care manager/care coordinator for the patient */
  careManager?: Reference<'Practitioner' | 'PractitionerRole'>;
  /* planned | waitlist | active | onhold | finished | cancelled | entered-in-error */
  status: 'active' | 'cancelled' | 'entered-in-error' | 'finished' | 'onhold' | 'planned' | 'waitlist';
  /* Interval during responsibility is assumed */
  period?: Period;
  _status?: Element;
  /* The patient who is the focus of this episode of care */
  patient: Reference<'Patient'>;
  statusHistory?: {
    /* Duration the EpisodeOfCare was in the specified status */
    period: Period;
    _status?: Element;
    /* planned | waitlist | active | onhold | finished | cancelled | entered-in-error */
    status: 'active' | 'cancelled' | 'entered-in-error' | 'finished' | 'onhold' | 'planned' | 'waitlist';
  };
  diagnosis?: {
    _rank?: Element;
    /* Conditions/problems/diagnoses this episode of care is for */
    condition: Reference<'Condition'>;
    /* Ranking of the diagnosis (for each role type) */
    rank?: positiveInt;
    /* Role that this diagnosis has within the episode of care (e.g. admission, billing, discharge …) */
    role?: 'AD' | 'billing' | 'CC' | 'CM' | 'DD' | 'post-op' | 'pre-op';
  };
  account?: Array<Reference<'Account'>>;
  'type'?: CodeableConcept;
  /* Organization that assumes care */
  managingOrganization?: Reference<'Organization'>;
}

/* This patient is known to be an animal. */
export interface patientAnimal {
  /* The animal breed.  E.g. Poodle, Angus. */
  breed?: CodeableConcept;
  /* The status of the animal's reproductive parts.  E.g. Neutered, Intact. */
  genderStatus?: CodeableConcept;
  /* The animal species.  E.g. Dog, Cow. */
  species: CodeableConcept;
}

/* A record of an event made for purposes of maintaining a security log. Typical uses include detection of intrusion attempts and monitoring for inappropriate usage. */
export interface AuditEvent extends DomainResource, Resource<'AuditEvent'> {
  /* Whether the event succeeded or failed */
  outcome?: '0' | '12' | '4' | '8';
  /* Time when the event was recorded */
  recorded: instant;
  /* Type/identifier of event */
  'type': Coding;
  subtype?: Coding;
  /* When the activity occurred */
  period?: Period;
  /* Description of the event outcome */
  outcomeDesc?: string;
  entity?: {
    detail?: {
      /* Name of the property */
      'type': string;
      _type?: Element;
      /* Property value */
      value?: {
        string?: string;
        _string?: Element;
        base64Binary?: base64Binary;
        _base64Binary?: Element;
      };
    };
    /* Type of entity involved */
    'type'?: Coding;
    _query?: Element;
    _description?: Element;
    /* What role the entity played */
    role?: Coding;
    /* Specific instance of resource */
    what?: Reference<'Reference'>;
    securityLabel?: Coding;
    _name?: Element;
    /* Descriptive text */
    description?: string;
    /* Descriptor for entity */
    name?: string;
    /* Query parameters */
    query?: base64Binary;
    /* Life-cycle stage for the entity */
    lifecycle?: Coding;
  };
  agent: {
    _policy?: Element;
    _altId?: Element;
    /* Logical network location for application activity */
    network?: {
      /* Identifier for the network access point of the user device */
      address?: string;
      _type?: Element;
      _address?: Element;
      /* The type of network access point */
      'type'?: '1' | '2' | '3' | '4' | '5';
    };
    purposeOfUse?: CodeableConcept;
    role?: CodeableConcept;
    /* How agent participated */
    'type'?: CodeableConcept;
    /* Identifier of who */
    who?: Reference<'Organization' | 'Patient' | 'Practitioner' | 'PractitionerRole' | 'RelatedPerson' | 'Device'>;
    /* Alternative User identity */
    altId?: string;
    /* Human friendly name for the agent */
    name?: string;
    /* Whether user is initiator */
    requestor: boolean;
    /* Where */
    location?: Reference<'Location'>;
    _requestor?: Element;
    /* Type of media */
    media?: Coding;
    policy?: uri;
    _name?: Element;
  };
  _action?: Element;
  /* Type of action performed during the event */
  action?: 'C' | 'D' | 'E' | 'R' | 'U';
  purposeOfEvent?: CodeableConcept;
  _outcomeDesc?: Element;
  /* Audit Event Reporter */
  source?: {
    _site?: Element;
    /* Logical source location within the enterprise */
    site?: string;
    /* The identity of source detecting the event */
    observer: Reference<'Device' | 'Patient' | 'PractitionerRole' | 'Organization' | 'Practitioner' | 'RelatedPerson'>;
    'type'?: Coding;
  };
  _outcome?: Element;
  _recorded?: Element;
}

/* The Care Team includes all the people and organizations who plan to participate in the coordination and delivery of care for a patient. */
export interface CareTeam extends DomainResource, Resource<'CareTeam'> {
  _name?: Element;
  /* Who care team is for */
  subject?: Reference<'Patient' | 'Group'>;
  reasonCode?: CodeableConcept;
  identifier?: Identifier;
  telecom?: ContactPoint;
  reasonReference?: Array<Reference<'Condition'>>;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  category?: CodeableConcept;
  /* Name of the team, such as crisis assessment team */
  name?: string;
  /* Time period team covers */
  period?: Period;
  _status?: Element;
  managingOrganization?: Array<Reference<'Organization'>>;
  /* proposed | active | suspended | inactive | entered-in-error */
  status?: 'active' | 'entered-in-error' | 'inactive' | 'proposed' | 'suspended';
  note?: Annotation;
  participant?: {
    role?: CodeableConcept;
    /* Who is involved */
    member?: Reference<'Patient' | 'Organization' | 'CareTeam' | 'Practitioner' | 'PractitionerRole' | 'RelatedPerson'>;
    /* Organization of the practitioner */
    onBehalfOf?: Reference<'Organization'>;
    /* Time period of participant */
    period?: Period;
  };
}

/* This extension defines a possible search parameter combination,  by listing a set of search parameters and indicating whether they are required or optional. If a search combination is specified, clients should expect that they must submit a search that meets one of the required combinations or the search will be unsuccessful. If multiple search parameter combinations are specified, a client may pick between them, and supply the minimal required parameters for any of the combinations. */
export interface capabilitystatementSearchParameterCombination {
  optional?: string;
  required: string;
}

/* Base StructureDefinition for uuid type: A UUID, represented as a URI */
export type uuid = string;
/* Additional bibliographic reference information about genetics, medications, clinical trials, etc. associated with knowledge-based information on genetics/genetic condition. */
export interface DiagnosticReportGeneticsReferences {
  /* Reference description */
  description?: string;
  reference?: uri;
  /* Reference type */
  'type'?: CodeableConcept;
}

export type RPCgetProvider = {
  method: 'relatient.pmsystem/get-provider';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for date Type: A date or partial date (e.g. just year or year + month). There is no time zone. The format is a union of the schema types gYear, gYearMonth and date.  Dates SHALL be valid dates. */
export type date = string;
export type RPCgetRadixConcept = {
  method: 'relatient.terminology/get-radix-concept';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for dateTime Type: A date, date-time or partial date (e.g. just year or year + month).  If hours and minutes are specified, a time zone SHALL be populated. The format is a union of the schema types gYear, gYearMonth, date and dateTime. Seconds must be provided due to schema type constraints but may be zero-filled and may be ignored.                 Dates SHALL be valid dates. */
export type dateTime = string;
/* Base StructureDefinition for Count Type: A measured amount (or an amount that can potentially be measured). Note that measured amounts include amounts that are not precisely quantified, including amounts involving arbitrary units and floating currencies. */
export type Count = Quantity;
/* The MeasureReport resource contains the results of the calculation of a measure; and optionally a reference to the resources involved in that calculation. */
export interface MeasureReport extends DomainResource, Resource<'MeasureReport'> {
  /* increase | decrease */
  improvementNotation?: 'decrease' | 'increase';
  /* What period the report covers */
  period: Period;
  group?: {
    /* What score this group achieved */
    measureScore?: Quantity;
    stratifier?: {
      code?: CodeableConcept;
      stratum?: {
        population?: {
          /* Size of the population */
          count?: integer;
          /* For subject-list reports, the subject results in this population */
          subjectResults?: Reference<'List'>;
          _count?: Element;
          /* initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation */
          code?: CodeableConcept;
        };
        component?: {
          /* What stratifier component of the group */
          code: CodeableConcept;
          /* The stratum component value, e.g. male */
          value: CodeableConcept;
        };
        /* What score this stratum achieved */
        measureScore?: Quantity;
        /* The stratum value, e.g. male */
        value?: CodeableConcept;
      };
    };
    /* Meaning of the group */
    code?: CodeableConcept;
    population?: {
      /* For subject-list reports, the subject results in this population */
      subjectResults?: Reference<'List'>;
      /* initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation */
      code?: CodeableConcept;
      _count?: Element;
      /* Size of the population */
      count?: integer;
    };
  };
  _measure?: Element;
  /* Who is reporting the data */
  reporter?: Reference<'PractitionerRole' | 'Location' | 'Practitioner' | 'Organization'>;
  /* What measure was calculated */
  measure: canonical;
  _type?: Element;
  _status?: Element;
  identifier?: Identifier;
  /* When the report was generated */
  date?: dateTime;
  /* What individual(s) the report is for */
  subject?: Reference<
    'Practitioner' | 'RelatedPerson' | 'PractitionerRole' | 'Device' | 'Location' | 'Group' | 'Patient'
  >;
  _date?: Element;
  /* individual | subject-list | summary | data-collection */
  'type': 'data-collection' | 'individual' | 'subject-list' | 'summary';
  /* complete | pending | error */
  status: 'complete' | 'error' | 'pending';
  evaluatedResource?: Array<Reference<'Reference'>>;
}

/* A photo, video, or audio recording acquired or used in healthcare. The actual content may be inline or provided by direct reference. */
export interface Media extends DomainResource, Resource<'Media'> {
  /* preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown */
  status:
    | 'completed'
    | 'entered-in-error'
    | 'in-progress'
    | 'not-done'
    | 'on-hold'
    | 'preparation'
    | 'stopped'
    | 'unknown';
  _width?: Element;
  /* Width of the image in pixels (photo/video) */
  width?: positiveInt;
  _issued?: Element;
  /* Number of frames if > 1 (photo) */
  frames?: positiveInt;
  _deviceName?: Element;
  /* Height of the image in pixels (photo/video) */
  height?: positiveInt;
  _frames?: Element;
  /* Imaging view, e.g. Lateral or Antero-posterior */
  view?: CodeableConcept;
  /* Observed body part */
  bodySite?: CodeableConcept;
  identifier?: Identifier;
  /* Actual Media - reference or data */
  content: Attachment;
  reasonCode?: CodeableConcept;
  /* Name of the device/manufacturer */
  deviceName?: string;
  /* Who/What this Media is a record of */
  subject?: Reference<'Device' | 'Patient' | 'Group' | 'PractitionerRole' | 'Location' | 'Practitioner' | 'Specimen'>;
  /* Encounter associated with media */
  encounter?: Reference<'Encounter'>;
  _height?: Element;
  basedOn?: Array<Reference<'CarePlan' | 'ServiceRequest'>>;
  /* When Media was collected */
  created?: {
    dateTime?: dateTime;
    Period?: Period;
    _dateTime?: Element;
  };
  /* Observing Device */
  device?: Reference<'DeviceMetric' | 'Device'>;
  /* The person who generated the image */
  operator?: Reference<
    'PractitionerRole' | 'CareTeam' | 'Device' | 'Practitioner' | 'Organization' | 'Patient' | 'RelatedPerson'
  >;
  partOf?: Array<Reference<'Reference'>>;
  /* Classification of media as image, video, or audio */
  'type'?: CodeableConcept;
  _status?: Element;
  /* The type of acquisition equipment/process */
  modality?: CodeableConcept;
  /* Length in seconds (audio / video) */
  duration?: decimal;
  /* Date/Time this version was made available */
  issued?: instant;
  _duration?: Element;
  note?: Annotation;
}

/* Phase set information. */
export interface observationGeneticsPhaseSet {
  /* Phase set ID */
  Id?: uri;
  MolecularSequence: Array<Reference<'MolecularSequence'>>;
}

/* Base StructureDefinition for Range Type: A set of ordered Quantities defined by a low and high limit. */
export interface Range extends Element {
  /* Low limit */
  low?: Quantity;
  /* High limit */
  high?: Quantity;
}

export type RPCfindSlots = {
  method: 'rpc.elastic/find-slots';
  params: {
    [key: string]: any;
  };
};
/* Set of definitional characteristics for a kind of observation or measurement produced or consumed by an orderable health care service. */
export interface ObservationDefinition extends DomainResource, Resource<'ObservationDefinition'> {
  /* Value set of normal coded values for the observations conforming to this ObservationDefinition */
  normalCodedValueSet?: Reference<'ValueSet'>;
  /* Value set of valid coded values for the observations conforming to this ObservationDefinition */
  validCodedValueSet?: Reference<'ValueSet'>;
  /* Preferred report name */
  preferredReportName?: string;
  /* Multiple results allowed */
  multipleResultsAllowed?: boolean;
  identifier?: Identifier;
  /* Method used to produce the observation */
  method?: CodeableConcept;
  permittedDataType?: Array<
    | 'boolean'
    | 'CodeableConcept'
    | 'dateTime'
    | 'integer'
    | 'Period'
    | 'Quantity'
    | 'Range'
    | 'Ratio'
    | 'SampledData'
    | 'string'
    | 'time'
  >;
  qualifiedInterval?: {
    /* Condition associated with the reference range */
    condition?: string;
    /* Applicable gestational age range, if relevant */
    gestationalAge?: Range;
    _condition?: Element;
    appliesTo?: CodeableConcept;
    /* reference | critical | absolute */
    category?: 'absolute' | 'critical' | 'reference';
    /* male | female | other | unknown */
    gender?: 'female' | 'male' | 'other' | 'unknown';
    /* The interval itself, for continuous or ordinal observations */
    range?: Range;
    _category?: Element;
    _gender?: Element;
    /* Applicable age range, if relevant */
    age?: Range;
    /* Range context qualifier */
    context?: CodeableConcept;
  };
  _multipleResultsAllowed?: Element;
  /* Value set of critical coded values for the observations conforming to this ObservationDefinition */
  criticalCodedValueSet?: Reference<'ValueSet'>;
  _permittedDataType?: Element;
  /* Type of observation (code / type) */
  code: CodeableConcept;
  /* Characteristics of quantitative results */
  quantitativeDetails?: {
    /* Decimal precision of observation quantitative results */
    decimalPrecision?: integer;
    /* Customary unit for quantitative results */
    customaryUnit?: CodeableConcept;
    /* SI to Customary unit conversion factor */
    conversionFactor?: decimal;
    _conversionFactor?: Element;
    /* SI unit for quantitative results */
    unit?: CodeableConcept;
    _decimalPrecision?: Element;
  };
  _preferredReportName?: Element;
  category?: CodeableConcept;
  /* Value set of abnormal coded values for the observations conforming to this ObservationDefinition */
  abnormalCodedValueSet?: Reference<'ValueSet'>;
}

/* The patient's legal status as citizen of a country. */
export interface patientCitizenship {
  /* Nation code of citizenship */
  code?: CodeableConcept;
  /* Time period of citizenship */
  period?: Period;
}

export type RPCgetAppointmentType = {
  method: 'relatient.pmsystem/get-appointment-type';
  params: {
    account: string;
    'pm-id': string;
    id?: string;
  };
};
export interface Practitioner extends DomainResource, Resource<'Practitioner'> {
  /* The date  on which the practitioner was born */
  birthDate?: date;
  _active?: Element;
  identifier?: Identifier;
  qualification?: {
    identifier?: Identifier;
    /* Coded representation of the qualification */
    code: CodeableConcept;
    /* Organization that regulates and issues the qualification */
    issuer?: Reference<'Organization'>;
    /* Period during which the qualification is valid */
    period?: Period;
  };
  telecom?: ContactPoint;
  name?: HumanName;
  /* male | female | other | unknown */
  gender?: 'female' | 'male' | 'other' | 'unknown';
  photo?: Attachment;
  _gender?: Element;
  communication?: Array<CodeableConcept>;
  address?: Address;
  _birthDate?: Element;
  /* Whether this practitioner's record is in active use */
  active?: boolean;
}

/* Specifies that a date is relative to some event. The event happens [Duration] after [Event]. */
export interface relativeDate {
  /* Duration after the event */
  offset: Duration;
  /* Event that the date is relative to */
  event?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Reference'>;
  };
  /* before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end */
  relationship:
    | 'after'
    | 'after-end'
    | 'after-start'
    | 'before'
    | 'before-end'
    | 'before-start'
    | 'concurrent'
    | 'concurrent-with-end'
    | 'concurrent-with-start';
}

export type RPCprovidersToAidbox = {
  method: 'radix.integration/providers-to-aidbox-cli';
  params: {
    [key: string]: any;
  };
};
export interface XSlot extends Resource<'XSlot'> {
  [key: string]: any;
}

/* This resource is primarily used for the identification and definition of a medication for the purposes of prescribing, dispensing, and administering a medication as well as for making statements about medication use. */
export interface Medication extends DomainResource, Resource<'Medication'> {
  /* powder | tablets | capsule + */
  form?: CodeableConcept;
  /* Codes that identify this medication */
  code?: CodeableConcept;
  /* Amount of drug in package */
  amount?: Ratio;
  identifier?: Identifier;
  ingredient?: {
    /* Quantity of ingredient present */
    strength?: Ratio;
    _isActive?: Element;
    /* Active ingredient indicator */
    isActive?: boolean;
    /* The actual ingredient or content */
    item?: {
      Reference?: Reference<'Medication' | 'Substance'>;
      CodeableConcept?: CodeableConcept;
    };
  };
  /* Manufacturer of the item */
  manufacturer?: Reference<'Organization'>;
  /* active | inactive | entered-in-error */
  status?: 'active' | 'entered-in-error' | 'inactive';
  /* Details about packaged medications */
  batch?: {
    _expirationDate?: Element;
    /* Identifier assigned to batch */
    lotNumber?: string;
    _lotNumber?: Element;
    /* When batch will expire */
    expirationDate?: dateTime;
  };
  _status?: Element;
}

/* Raw data describing a biological sequence. */
export interface MolecularSequence extends DomainResource, Resource<'MolecularSequence'> {
  _type?: Element;
  _observedSeq?: Element;
  /* The method for sequencing */
  device?: Reference<'Device'>;
  identifier?: Identifier;
  pointer?: Array<Reference<'MolecularSequence'>>;
  _readCoverage?: Element;
  /* The number of copies of the sequence of interest.  (RNASeq) */
  quantity?: Quantity;
  /* Average number of reads representing a given nucleotide in the reconstructed sequence */
  readCoverage?: integer;
  variant?: {
    /* Allele that was observed */
    observedAllele?: string;
    _referenceAllele?: Element;
    /* End position of the variant on the reference sequence */
    end?: integer;
    /* Start position of the variant on the  reference sequence */
    start?: integer;
    /* Pointer to observed variant information */
    variantPointer?: Reference<'Observation'>;
    _end?: Element;
    /* Allele in the reference sequence */
    referenceAllele?: string;
    _observedAllele?: Element;
    _start?: Element;
    /* Extended CIGAR string for aligning the sequence with reference bases */
    cigar?: string;
    _cigar?: Element;
  };
  /* Sequence that was observed */
  observedSeq?: string;
  /* A sequence used as reference */
  referenceSeq?: {
    _orientation?: Element;
    _windowEnd?: Element;
    _referenceSeqString?: Element;
    _genomeBuild?: Element;
    /* A pointer to another MolecularSequence entity as reference sequence */
    referenceSeqPointer?: Reference<'MolecularSequence'>;
    /* A string to represent reference sequence */
    referenceSeqString?: string;
    /* Chromosome containing genetic finding */
    chromosome?: CodeableConcept;
    _strand?: Element;
    /* Reference identifier */
    referenceSeqId?: CodeableConcept;
    /* sense | antisense */
    orientation?: 'antisense' | 'sense';
    /* The Genome Build used for reference, following GRCh build versions e.g. 'GRCh 37' */
    genomeBuild?: string;
    /* watson | crick */
    strand?: 'crick' | 'watson';
    /* End position of the window on the reference sequence */
    windowEnd?: integer;
    _windowStart?: Element;
    /* Start position of the window on the  reference sequence */
    windowStart?: integer;
  };
  quality?: {
    /* True positives from the perspective of the truth data */
    truthTP?: decimal;
    _precision?: Element;
    /* Precision of comparison */
    precision?: decimal;
    /* True positives from the perspective of the query data */
    queryTP?: decimal;
    _fScore?: Element;
    /* False positives */
    queryFP?: decimal;
    /* Method to get quality */
    method?: CodeableConcept;
    _gtFP?: Element;
    /* False negatives */
    truthFN?: decimal;
    _truthFN?: Element;
    /* Standard sequence for comparison */
    standardSequence?: CodeableConcept;
    /* Recall of comparison */
    recall?: decimal;
    /* indel | snp | unknown */
    'type': 'indel' | 'snp' | 'unknown';
    _queryFP?: Element;
    /* Quality score for the comparison */
    score?: Quantity;
    /* End position of the sequence */
    end?: integer;
    _truthTP?: Element;
    _queryTP?: Element;
    _end?: Element;
    _type?: Element;
    /* Start position of the sequence */
    start?: integer;
    _recall?: Element;
    /* F-score */
    fScore?: decimal;
    /* False positives where the non-REF alleles in the Truth and Query Call Sets match */
    gtFP?: decimal;
    /* Receiver Operator Characteristic (ROC) Curve */
    roc?: {
      _numFP?: Element;
      fMeasure?: decimal;
      numTP?: integer;
      score?: integer;
      numFN?: integer;
      _score?: Element;
      sensitivity?: decimal;
      _precision?: Element;
      _sensitivity?: Element;
      precision?: decimal;
      numFP?: integer;
      _fMeasure?: Element;
      _numFN?: Element;
      _numTP?: Element;
    };
    _start?: Element;
  };
  _coordinateSystem?: Element;
  repository?: {
    /* Repository's name */
    name?: string;
    _variantsetId?: Element;
    _readsetId?: Element;
    /* URI of the repository */
    url?: uri;
    /* directlink | openapi | login | oauth | other */
    'type': 'directlink' | 'login' | 'oauth' | 'openapi' | 'other';
    _datasetId?: Element;
    _name?: Element;
    /* Id of the variantset that used to call for variantset in repository */
    variantsetId?: string;
    /* Id of the read */
    readsetId?: string;
    _type?: Element;
    /* Id of the dataset that used to call for dataset in repository */
    datasetId?: string;
    _url?: Element;
  };
  /* Who and/or what this is about */
  patient?: Reference<'Patient'>;
  structureVariant?: {
    /* Structural variant change type */
    variantType?: CodeableConcept;
    _length?: Element;
    /* Does the structural variant have base pair resolution breakpoints? */
    exact?: boolean;
    /* Structural variant length */
    length?: integer;
    /* Structural variant inner */
    inner?: {
      _end?: Element;
      /* Structural variant inner start */
      start?: integer;
      _start?: Element;
      /* Structural variant inner end */
      end?: integer;
    };
    /* Structural variant outer */
    outer?: {
      _start?: Element;
      /* Structural variant outer start */
      start?: integer;
      /* Structural variant outer end */
      end?: integer;
      _end?: Element;
    };
    _exact?: Element;
  };
  /* aa | dna | rna */
  'type'?: 'aa' | 'dna' | 'rna';
  /* Base number of coordinate system (0 for 0-based numbering or coordinates, inclusive start, exclusive end, 1 for 1-based numbering, inclusive start, inclusive end) */
  coordinateSystem: integer;
  /* Specimen used for sequencing */
  specimen?: Reference<'Specimen'>;
  /* Who should be responsible for test result */
  performer?: Reference<'Organization'>;
}

export type RPCsaveRule = {
  method: 'relatient.rule-engine-v2/save-rule';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for Population Type: A populatioof people with some set of grouping criteria. */
export interface Population extends BackboneElement {
  /* The gender of the specific population */
  gender?: CodeableConcept;
  /* Race of the specific population */
  race?: CodeableConcept;
  /* The existing physiological conditions of the specific population to which this applies */
  physiologicalCondition?: CodeableConcept;
  /* The age of the specific population */
  age?: {
    CodeableConcept?: CodeableConcept;
    Range?: Range;
  };
}

export type RPCprocessSlots = {
  method: 'relatient.processing/process-slots';
  params: {
    [key: string]: any;
  };
};
/* A Map of relationships between 2 structures that can be used to transform data. */
export interface StructureMap extends DomainResource, Resource<'StructureMap'> {
  /* Canonical identifier for this structure map, represented as a URI (globally unique) */
  url: uri;
  _purpose?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _experimental?: Element;
  /* Date last changed */
  date?: dateTime;
  /* Name for this structure map (computer friendly) */
  name: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  useContext?: UsageContext;
  identifier?: Identifier;
  _version?: Element;
  jurisdiction?: CodeableConcept;
  /* Why this structure map is defined */
  purpose?: markdown;
  _status?: Element;
  /* Business version of the structure map */
  version?: string;
  _date?: Element;
  _copyright?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  _import?: Element;
  _name?: Element;
  _publisher?: Element;
  /* Natural language description of the structure map */
  description?: markdown;
  structure?: {
    _url?: Element;
    /* Name for type in this map */
    alias?: string;
    _mode?: Element;
    /* Documentation on use of structure */
    documentation?: string;
    /* Canonical reference to structure definition */
    url: canonical;
    _alias?: Element;
    /* source | queried | target | produced */
    mode: 'produced' | 'queried' | 'source' | 'target';
    _documentation?: Element;
  };
  _description?: Element;
  contact?: ContactDetail;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Name for this structure map (human friendly) */
  title?: string;
  import?: canonical;
  _title?: Element;
  _url?: Element;
  group: {
    /* Human-readable label */
    name: id;
    /* Additional description/explanation for group */
    documentation?: string;
    /* none | types | type-and-types */
    typeMode: 'none' | 'type-and-types' | 'types';
    _name?: Element;
    rule: {
      /* Documentation for this instance of data */
      documentation?: string;
      _documentation?: Element;
      rule?: any;
      /* Name of the rule for internal references */
      name: id;
      dependent?: {
        _name?: Element;
        _variable?: Element;
        variable: string;
        /* Name of a rule or group to apply */
        name: id;
      };
      source: {
        _condition?: Element;
        _element?: Element;
        /* first | not_first | last | not_last | only_one */
        listMode?: 'first' | 'last' | 'not_first' | 'not_last' | 'only_one';
        /* Specified maximum cardinality (number or *) */
        max?: string;
        /* Specified minimum cardinality */
        min?: integer;
        _check?: Element;
        _variable?: Element;
        /* Default value if no value exists */
        defaultValue?: {
          Age?: Age;
          TriggerDefinition?: TriggerDefinition;
          UsageContext?: UsageContext;
          _markdown?: Element;
          integer?: integer;
          positiveInt?: positiveInt;
          Count?: Count;
          Timing?: Timing;
          uuid?: uuid;
          _code?: Element;
          Money?: Money;
          Reference?: Reference<'Reference'>;
          instant?: instant;
          Distance?: Distance;
          uri?: uri;
          _date?: Element;
          ContactDetail?: ContactDetail;
          _oid?: Element;
          boolean?: boolean;
          date?: date;
          unsignedInt?: unsignedInt;
          canonical?: canonical;
          string?: string;
          _uri?: Element;
          DataRequirement?: DataRequirement;
          Annotation?: Annotation;
          CodeableConcept?: CodeableConcept;
          Range?: Range;
          SampledData?: SampledData;
          _url?: Element;
          time?: time;
          Meta?: Meta;
          _canonical?: Element;
          _unsignedInt?: Element;
          oid?: oid;
          _instant?: Element;
          ContactPoint?: ContactPoint;
          Ratio?: Ratio;
          Expression?: Expression;
          Attachment?: Attachment;
          _integer?: Element;
          Signature?: Signature;
          url?: url;
          Period?: Period;
          Duration?: Duration;
          Identifier?: Identifier;
          _decimal?: Element;
          _id?: Element;
          _time?: Element;
          id?: id;
          Quantity?: Quantity;
          _uuid?: Element;
          decimal?: decimal;
          ParameterDefinition?: ParameterDefinition;
          RelatedArtifact?: RelatedArtifact;
          base64Binary?: base64Binary;
          markdown?: markdown;
          _string?: Element;
          _boolean?: Element;
          Address?: Address;
          HumanName?: HumanName;
          _positiveInt?: Element;
          code?: code;
          Coding?: Coding;
          Dosage?: Dosage;
          _base64Binary?: Element;
          _dateTime?: Element;
          Contributor?: Contributor;
          dateTime?: dateTime;
        };
        /* Named context for field, if a field is specified */
        variable?: id;
        /* FHIRPath expression  - must be true or the mapping engine throws an error instead of completing */
        check?: string;
        /* Rule only applies if source has this type */
        'type'?: string;
        /* Optional field for this source */
        element?: string;
        _context?: Element;
        _max?: Element;
        _logMessage?: Element;
        _listMode?: Element;
        /* FHIRPath expression  - must be true or the rule does not apply */
        condition?: string;
        _min?: Element;
        /* Message to put in log if source exists (FHIRPath) */
        logMessage?: string;
        /* Type or variable this rule applies to */
        context: id;
        _type?: Element;
      };
      target?: {
        _variable?: Element;
        _contextType?: Element;
        listMode?: Array<'collate' | 'first' | 'last' | 'share'>;
        _listRuleId?: Element;
        _listMode?: Element;
        parameter?: {
          /* Parameter value - variable or literal */
          value?: {
            _decimal?: Element;
            _integer?: Element;
            _string?: Element;
            string?: string;
            id?: id;
            boolean?: boolean;
            decimal?: decimal;
            _id?: Element;
            _boolean?: Element;
            integer?: integer;
          };
        };
        _element?: Element;
        /* Field to create in the context */
        element?: string;
        _transform?: Element;
        /* type | variable */
        contextType?: 'type' | 'variable';
        /* create | copy + */
        transform?:
          | 'append'
          | 'c'
          | 'cast'
          | 'cc'
          | 'copy'
          | 'cp'
          | 'create'
          | 'dateOp'
          | 'escape'
          | 'evaluate'
          | 'id'
          | 'pointer'
          | 'qty'
          | 'reference'
          | 'translate'
          | 'truncate'
          | 'uuid';
        /* Named context for field, if desired, and a field is specified */
        variable?: id;
        /* Internal rule reference for shared list items */
        listRuleId?: id;
        /* Type or variable this rule applies to */
        context?: id;
        _context?: Element;
      };
      _name?: Element;
    };
    input: {
      _mode?: Element;
      /* Type for this instance of data */
      'type'?: string;
      _type?: Element;
      _name?: Element;
      /* source | target */
      mode: 'source' | 'target';
      /* Documentation for this instance of data */
      documentation?: string;
      /* Name for this instance of data */
      name: id;
      _documentation?: Element;
    };
    _documentation?: Element;
    /* Another group that this group adds rules to */
    extends?: id;
    _extends?: Element;
    _typeMode?: Element;
  };
}

export type RPCgetLocations = {
  method: 'relatient.workshift/get-locations';
  params: {
    [key: string]: any;
  };
};
/* A material substance originating from a biological entity intended to be transplanted or infused
into another (possibly the same) biological entity. */
export interface BiologicallyDerivedProduct extends DomainResource, Resource<'BiologicallyDerivedProduct'> {
  _status?: Element;
  /* The amount of this biologically derived product */
  quantity?: integer;
  /* What this biologically derived product is */
  productCode?: CodeableConcept;
  identifier?: Identifier;
  /* available | unavailable */
  status?: 'available' | 'unavailable';
  /* How this product was collected */
  collection?: {
    /* Time of product collection */
    collected?: {
      Period?: Period;
      dateTime?: dateTime;
      _dateTime?: Element;
    };
    /* Who is product from */
    source?: Reference<'Patient' | 'Organization'>;
    /* Individual performing collection */
    collector?: Reference<'PractitionerRole' | 'Practitioner'>;
  };
  /* Any manipulation of product post-collection */
  manipulation?: {
    /* Time of manipulation */
    time?: {
      _dateTime?: Element;
      dateTime?: dateTime;
      Period?: Period;
    };
    _description?: Element;
    /* Description of manipulation */
    description?: string;
  };
  storage?: {
    /* Storage temperature */
    temperature?: decimal;
    _temperature?: Element;
    /* farenheit | celsius | kelvin */
    scale?: 'celsius' | 'farenheit' | 'kelvin';
    _scale?: Element;
    _description?: Element;
    /* Description of storage */
    description?: string;
    /* Storage timeperiod */
    duration?: Period;
  };
  _quantity?: Element;
  parent?: Array<Reference<'BiologicallyDerivedProduct'>>;
  processing?: {
    _description?: Element;
    /* Description of of processing */
    description?: string;
    /* Procesing code */
    procedure?: CodeableConcept;
    /* Time of processing */
    time?: {
      Period?: Period;
      _dateTime?: Element;
      dateTime?: dateTime;
    };
    /* Substance added during processing */
    additive?: Reference<'Substance'>;
  };
  _productCategory?: Element;
  /* organ | tissue | fluid | cells | biologicalAgent */
  productCategory?: 'biologicalAgent' | 'cells' | 'fluid' | 'organ' | 'tissue';
  request?: Array<Reference<'ServiceRequest'>>;
}

/* Base StructureDefinition for Duration Type: A length of time. */
export type Duration = Quantity;
/* Base StructureDefinition for SubstanceAmount Type: Chemical substances are a single substance type whose primary defining element is the molecular structure. Chemical substances shall be defined on the basis of their complete covalent molecular structure; the presence of a salt (counter-ion) and/or solvates (water, alcohols) is also captured. Purity, grade, physical form or particle size are not taken into account in the definition of a chemical substance or in the assignment of a Substance ID. */
export interface SubstanceAmount extends BackboneElement {
  /* Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field */
  amount?: {
    string?: string;
    Quantity?: Quantity;
    Range?: Range;
    _string?: Element;
  };
  /* Most elements that require a quantitative value will also have a field called amount type. Amount type should always be specified because the actual value of the amount is often dependent on it. EXAMPLE: In capturing the actual relative amounts of substances or molecular fragments it is essential to indicate whether the amount refers to a mole ratio or weight ratio. For any given element an effort should be made to use same the amount type for all related definitional elements */
  amountType?: CodeableConcept;
  /* Reference range of possible or expected values */
  referenceRange?: {
    /* Upper limit possible or expected */
    highLimit?: Quantity;
    /* Lower limit possible or expected */
    lowLimit?: Quantity;
  };
  _amountText?: Element;
  /* A textual comment on a numeric value */
  amountText?: string;
}

/* A SubstanceProtein is defined as a single unit of a linear amino acid sequence, or a combination of subunits that are either covalently linked or have a defined invariant stoichiometric relationship. This includes all synthetic, recombinant and purified SubstanceProteins of defined sequence, whether the use is therapeutic or prophylactic. This set of elements will be used to describe albumins, coagulation factors, cytokines, growth factors, peptide/SubstanceProtein hormones, enzymes, toxins, toxoids, recombinant vaccines, and immunomodulators. */
export interface SubstanceProtein extends DomainResource, Resource<'SubstanceProtein'> {
  /* The SubstanceProtein descriptive elements will only be used when a complete or partial amino acid sequence is available or derivable from a nucleic acid sequence */
  sequenceType?: CodeableConcept;
  subunit?: {
    /* Index of primary sequences of amino acids linked through peptide bonds in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts */
    subunit?: integer;
    /* The name of the fragment modified at the N-terminal of the SubstanceProtein shall be specified */
    nTerminalModification?: string;
    _nTerminalModification?: Element;
    /* The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence */
    sequence?: string;
    /* The modification at the C-terminal shall be specified */
    cTerminalModification?: string;
    _cTerminalModification?: Element;
    _length?: Element;
    _sequence?: Element;
    /* Length of linear sequences of amino acids contained in the subunit */
    length?: integer;
    _subunit?: Element;
    /* Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID */
    cTerminalModificationId?: Identifier;
    /* Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID */
    nTerminalModificationId?: Identifier;
    /* The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence */
    sequenceAttachment?: Attachment;
  };
  _disulfideLinkage?: Element;
  /* Number of linear sequences of amino acids linked through peptide bonds. The number of subunits constituting the SubstanceProtein shall be described. It is possible that the number of subunits can be variable */
  numberOfSubunits?: integer;
  disulfideLinkage?: string;
  _numberOfSubunits?: Element;
}

/* Additional instructions for the user to guide their input (i.e. a human readable version of a regular expression like "nnn-nnn-nnn"). In most UIs this is the placeholder (or 'ghost') text placed directly inside the edit controls and that disappear when the control gets the focus. */
export type entryFormat = string;
/* glstring. */
export interface hlaGenotypingResultsGlstring {
  /* glstring.url */
  url?: uri;
  /* glstring.text */
  text?: string;
}

/* A TerminologyCapabilities resource documents a set of capabilities (behaviors) of a FHIR Terminology Server that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */
export interface TerminologyCapabilities extends DomainResource, Resource<'TerminologyCapabilities'> {
  /* Natural language description of the terminology capabilities */
  description?: markdown;
  /* If this describes a specific instance */
  implementation?: {
    /* Base URL for the implementation */
    url?: url;
    _url?: Element;
    _description?: Element;
    /* Describes this specific instance */
    description: string;
  };
  _date?: Element;
  jurisdiction?: CodeableConcept;
  /* Name for this terminology capabilities (human friendly) */
  title?: string;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  contact?: ContactDetail;
  _experimental?: Element;
  /* Whether lockedDate is supported */
  lockedDate?: boolean;
  _title?: Element;
  _purpose?: Element;
  /* Name for this terminology capabilities (computer friendly) */
  name?: string;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _lockedDate?: Element;
  _name?: Element;
  _status?: Element;
  /* Information about the [ConceptMap/$closure](conceptmap-operation-closure.html) operation */
  closure?: {
    /* If cross-system closure is supported */
    translation?: boolean;
    _translation?: Element;
  };
  /* Software that is covered by this terminology capability statement */
  software?: {
    _version?: Element;
    /* A name the software is known by */
    name: string;
    _name?: Element;
    /* Version covered by this statement */
    version?: string;
  };
  /* Information about the [ValueSet/$expand](valueset-operation-expand.html) operation */
  expansion?: {
    /* Documentation about text searching works */
    textFilter?: markdown;
    _textFilter?: Element;
    /* Whether the server supports paging on expansion */
    paging?: boolean;
    _paging?: Element;
    parameter?: {
      /* Description of support for parameter */
      documentation?: string;
      _name?: Element;
      /* Expansion Parameter name */
      name: code;
      _documentation?: Element;
    };
    _hierarchical?: Element;
    /* Allow request for incomplete expansions? */
    incomplete?: boolean;
    _incomplete?: Element;
    /* Whether the server can return nested value sets */
    hierarchical?: boolean;
  };
  /* instance | capability | requirements */
  kind: 'capability' | 'instance' | 'requirements';
  /* Date last changed */
  date: dateTime;
  /* Canonical identifier for this terminology capabilities, represented as a URI (globally unique) */
  url?: uri;
  /* Information about the [ValueSet/$validate-code](valueset-operation-validate-code.html) operation */
  validateCode?: {
    /* Whether translations are validated */
    translations: boolean;
    _translations?: Element;
  };
  _copyright?: Element;
  _version?: Element;
  _publisher?: Element;
  codeSystem?: {
    /* URI for the Code System */
    uri?: canonical;
    /* Whether subsumption is supported */
    subsumption?: boolean;
    version?: {
      _isDefault?: Element;
      /* If this is the default version for this code system */
      isDefault?: boolean;
      filter?: {
        _code?: Element;
        op: code;
        _op?: Element;
        /* Code of the property supported */
        code: code;
      };
      _language?: Element;
      language?: code;
      _compositional?: Element;
      _property?: Element;
      property?: code;
      /* If compositional grammar is supported */
      compositional?: boolean;
      /* Version identifier for this version */
      code?: string;
      _code?: Element;
    };
    _subsumption?: Element;
    _uri?: Element;
  };
  /* Why this terminology capabilities is defined */
  purpose?: markdown;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _kind?: Element;
  _url?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Information about the [ConceptMap/$translate](conceptmap-operation-translate.html) operation */
  translation?: {
    /* Whether the client must identify the map */
    needsMap: boolean;
    _needsMap?: Element;
  };
  /* Business version of the terminology capabilities */
  version?: string;
  _description?: Element;
  _codeSearch?: Element;
  useContext?: UsageContext;
  /* explicit | all */
  codeSearch?: 'all' | 'explicit';
}

/* Base StructureDefinition for id type: Any combination of letters, numerals, "-" and ".", with a length limit of 64 characters.  (This might be an integer, an unprefixed OID, UUID or any other identifier pattern that meets these constraints.)  Ids are case-insensitive. */
export type id = string;
/* Identifies the maximum number of decimal places that may be specified for the data element. */
export type maxDecimalPlaces = integer;
/* An assessment of the likely outcome(s) for a patient or other subject as well as the likelihood of each outcome. */
export interface RiskAssessment extends DomainResource, Resource<'RiskAssessment'> {
  _mitigation?: Element;
  /* Where was assessment performed? */
  encounter?: Reference<'Encounter'>;
  identifier?: Identifier;
  /* When was assessment made? */
  occurrence?: {
    _dateTime?: Element;
    dateTime?: dateTime;
    Period?: Period;
  };
  _status?: Element;
  note?: Annotation;
  /* Part of this occurrence */
  parent?: Reference<'Reference'>;
  /* Type of assessment */
  code?: CodeableConcept;
  /* Evaluation mechanism */
  method?: CodeableConcept;
  prediction?: {
    /* Likelihood of specified outcome as a qualitative value */
    qualitativeRisk?: CodeableConcept;
    _rationale?: Element;
    /* Possible outcome for the subject */
    outcome?: CodeableConcept;
    /* Timeframe or age range */
    when?: {
      Period?: Period;
      Range?: Range;
    };
    /* Likelihood of specified outcome */
    probability?: {
      Range?: Range;
      _decimal?: Element;
      decimal?: decimal;
    };
    _relativeRisk?: Element;
    /* Relative likelihood */
    relativeRisk?: decimal;
    /* Explanation of prediction */
    rationale?: string;
  };
  basis?: Array<Reference<'Reference'>>;
  /* Request fulfilled by this assessment */
  basedOn?: Reference<'Reference'>;
  reasonCode?: CodeableConcept;
  /* registered | preliminary | final | amended + */
  status:
    | 'amended'
    | 'cancelled'
    | 'corrected'
    | 'entered-in-error'
    | 'final'
    | 'preliminary'
    | 'registered'
    | 'unknown';
  reasonReference?: Array<Reference<'Observation' | 'DiagnosticReport' | 'Condition' | 'DocumentReference'>>;
  /* Condition assessed */
  condition?: Reference<'Condition'>;
  /* Who/what does assessment apply to? */
  subject: Reference<'Group' | 'Patient'>;
  /* How to reduce risk */
  mitigation?: string;
  /* Who did assessment? */
  performer?: Reference<'Device' | 'Practitioner' | 'PractitionerRole'>;
}

/* A guidance response is the formal response to a guidance request, including any output parameters returned by the evaluation, as well as the description of any proposed actions to be taken. */
export interface GuidanceResponse extends DomainResource, Resource<'GuidanceResponse'> {
  /* Proposed actions, if any */
  result?: Reference<'RequestGroup' | 'CarePlan'>;
  reasonReference?: Array<Reference<'Observation' | 'DocumentReference' | 'Condition' | 'DiagnosticReport'>>;
  evaluationMessage?: Array<Reference<'OperationOutcome'>>;
  /* Device returning the guidance */
  performer?: Reference<'Device'>;
  dataRequirement?: DataRequirement;
  /* When the guidance response was processed */
  occurrenceDateTime?: dateTime;
  _occurrenceDateTime?: Element;
  /* What guidance was requested */
  module?: {
    canonical?: canonical;
    uri?: uri;
    CodeableConcept?: CodeableConcept;
    _canonical?: Element;
    _uri?: Element;
  };
  /* The identifier of the request associated with this response, if any */
  requestIdentifier?: Identifier;
  /* Encounter during which the response was returned */
  encounter?: Reference<'Encounter'>;
  /* success | data-requested | data-required | in-progress | failure | entered-in-error */
  status: 'data-requested' | 'data-required' | 'entered-in-error' | 'failure' | 'in-progress' | 'success';
  reasonCode?: CodeableConcept;
  note?: Annotation;
  /* Patient the request was performed for */
  subject?: Reference<'Patient' | 'Group'>;
  _status?: Element;
  /* The output parameters of the evaluation, if any */
  outputParameters?: Reference<'Parameters'>;
  identifier?: Identifier;
}

export type RPCgetReadyToProcessSessions = {
  method: 'relatient.integration/get-ready-to-process-sessions';
  params: {
    [key: string]: any;
  };
};
export type RPCsaveValueset = {
  method: 'relatient.practitioner/save-valueset';
  params: {
    [key: string]: any;
  };
};
export interface EmailReport extends Resource<'EmailReport'> {
  messageId?: string;
  fileName?: string;
  systemAccount?: Reference<'SystemAccount'>;
  from?: string;
  status?: 'sent' | 'error' | 'skip';
  data?: {
    month?: string;
    day?: string;
    time?: string;
    year?: string;
  };
  to?: Array<string>;
  errorData?: any;
}

/* Base StructureDefinition for ProductShelfLife Type: The shelf-life and storage information for a medicinal product item or container can be described using this class. */
export interface ProductShelfLife extends BackboneElement {
  specialPrecautionsForStorage?: CodeableConcept;
  /* The shelf life time period can be specified using a numerical value for the period of time and its unit of time measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used */
  period: Quantity;
  /* This describes the shelf life, taking into account various scenarios such as shelf life of the packaged Medicinal Product itself, shelf life after transformation where necessary and shelf life after the first opening of a bottle, etc. The shelf life type shall be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified */
  'type': CodeableConcept;
  /* Unique identifier for the packaged Medicinal Product */
  identifier?: Identifier;
}

export interface sendEmail {
  subject: string;
  content: {
    'type': 'text/plain' | 'text/html';
    value: string;
  };
  to: string;
  /* If true we will skip real send email */
  'dry-run'?: boolean;
}

/* A set of rules of how a particular interoperability or standards problem is solved - typically through the use of FHIR resources. This resource is used to gather all the parts of an implementation guide into a logical whole and to publish a computable definition of all the parts. */
export interface ImplementationGuide extends DomainResource, Resource<'ImplementationGuide'> {
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _title?: Element;
  _fhirVersion?: Element;
  _date?: Element;
  _description?: Element;
  _publisher?: Element;
  /* Date last changed */
  date?: dateTime;
  /* Canonical identifier for this implementation guide, represented as a URI (globally unique) */
  url: uri;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* NPM Package name for IG */
  packageId: id;
  /* Name for this implementation guide (computer friendly) */
  name: string;
  _license?: Element;
  _packageId?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Information needed to build the IG */
  definition?: {
    grouping?: {
      _name?: Element;
      /* Human readable text describing the package */
      description?: string;
      _description?: Element;
      /* Descriptive name for the package */
      name: string;
    };
    /* Page/Section in the Guide */
    page?: {
      /* Where to find that page */
      name?: {
        url?: url;
        Reference?: Reference<'Binary'>;
        _url?: Element;
      };
      _title?: Element;
      _generation?: Element;
      page?: any;
      /* Short title shown for navigational assistance */
      title: string;
      /* html | markdown | xml | generated */
      generation: 'generated' | 'html' | 'markdown' | 'xml';
    };
    resource: {
      /* Location of the resource */
      reference: Reference<'Reference'>;
      _fhirVersion?: Element;
      fhirVersion?: Array<
        | '0.01'
        | '0.05'
        | '0.06'
        | '0.0.80'
        | '0.0.81'
        | '0.0.82'
        | '0.11'
        | '0.4.0'
        | '0.5.0'
        | '1.0.0'
        | '1.0.1'
        | '1.0.2'
        | '1.1.0'
        | '1.4.0'
        | '1.6.0'
        | '1.8.0'
        | '3.0.0'
        | '3.0.1'
        | '3.3.0'
        | '3.5.0'
        | '4.0.0'
        | '4.0.1'
      >;
      /* Human Name for the resource */
      name?: string;
      /* Is an example/What is this an example of? */
      example?: {
        canonical?: canonical;
        _boolean?: Element;
        boolean?: boolean;
        _canonical?: Element;
      };
      _description?: Element;
      _groupingId?: Element;
      _name?: Element;
      /* Reason why included in guide */
      description?: string;
      /* Grouping this is part of */
      groupingId?: id;
    };
    template?: {
      _scope?: Element;
      /* Type of template specified */
      code: code;
      /* The source location for the template */
      source: string;
      _code?: Element;
      /* The scope in which the template applies */
      scope?: string;
      _source?: Element;
    };
    parameter?: {
      /* apply | path-resource | path-pages | path-tx-cache | expansion-parameter | rule-broken-links | generate-xml | generate-json | generate-turtle | html-template */
      code:
        | 'apply'
        | 'expansion-parameter'
        | 'generate-json'
        | 'generate-turtle'
        | 'generate-xml'
        | 'html-template'
        | 'path-pages'
        | 'path-resource'
        | 'path-tx-cache'
        | 'rule-broken-links';
      _code?: Element;
      _value?: Element;
      /* Value for named type */
      value: string;
    };
  };
  _name?: Element;
  global?: {
    _type?: Element;
    /* Profile that all resources must conform to */
    profile: canonical;
    /* Type this profile applies to */
    'type':
      | 'Account'
      | 'ActivityDefinition'
      | 'AdverseEvent'
      | 'AllergyIntolerance'
      | 'Appointment'
      | 'AppointmentResponse'
      | 'AuditEvent'
      | 'Basic'
      | 'Binary'
      | 'BiologicallyDerivedProduct'
      | 'BodyStructure'
      | 'Bundle'
      | 'CapabilityStatement'
      | 'CarePlan'
      | 'CareTeam'
      | 'CatalogEntry'
      | 'ChargeItem'
      | 'ChargeItemDefinition'
      | 'Claim'
      | 'ClaimResponse'
      | 'ClinicalImpression'
      | 'CodeSystem'
      | 'Communication'
      | 'CommunicationRequest'
      | 'CompartmentDefinition'
      | 'Composition'
      | 'ConceptMap'
      | 'Condition'
      | 'Consent'
      | 'Contract'
      | 'Coverage'
      | 'CoverageEligibilityRequest'
      | 'CoverageEligibilityResponse'
      | 'DetectedIssue'
      | 'Device'
      | 'DeviceDefinition'
      | 'DeviceMetric'
      | 'DeviceRequest'
      | 'DeviceUseStatement'
      | 'DiagnosticReport'
      | 'DocumentManifest'
      | 'DocumentReference'
      | 'DomainResource'
      | 'EffectEvidenceSynthesis'
      | 'Encounter'
      | 'Endpoint'
      | 'EnrollmentRequest'
      | 'EnrollmentResponse'
      | 'EpisodeOfCare'
      | 'EventDefinition'
      | 'Evidence'
      | 'EvidenceVariable'
      | 'ExampleScenario'
      | 'ExplanationOfBenefit'
      | 'FamilyMemberHistory'
      | 'Flag'
      | 'Goal'
      | 'GraphDefinition'
      | 'Group'
      | 'GuidanceResponse'
      | 'HealthcareService'
      | 'ImagingStudy'
      | 'Immunization'
      | 'ImmunizationEvaluation'
      | 'ImmunizationRecommendation'
      | 'ImplementationGuide'
      | 'InsurancePlan'
      | 'Invoice'
      | 'Library'
      | 'Linkage'
      | 'List'
      | 'Location'
      | 'Measure'
      | 'MeasureReport'
      | 'Media'
      | 'Medication'
      | 'MedicationAdministration'
      | 'MedicationDispense'
      | 'MedicationKnowledge'
      | 'MedicationRequest'
      | 'MedicationStatement'
      | 'MedicinalProduct'
      | 'MedicinalProductAuthorization'
      | 'MedicinalProductContraindication'
      | 'MedicinalProductIndication'
      | 'MedicinalProductIngredient'
      | 'MedicinalProductInteraction'
      | 'MedicinalProductManufactured'
      | 'MedicinalProductPackaged'
      | 'MedicinalProductPharmaceutical'
      | 'MedicinalProductUndesirableEffect'
      | 'MessageDefinition'
      | 'MessageHeader'
      | 'MolecularSequence'
      | 'NamingSystem'
      | 'NutritionOrder'
      | 'Observation'
      | 'ObservationDefinition'
      | 'OperationDefinition'
      | 'OperationOutcome';
    _profile?: Element;
  };
  fhirVersion: Array<
    | '0.01'
    | '0.05'
    | '0.06'
    | '0.0.80'
    | '0.0.81'
    | '0.0.82'
    | '0.11'
    | '0.4.0'
    | '0.5.0'
    | '1.0.0'
    | '1.0.1'
    | '1.0.2'
    | '1.1.0'
    | '1.4.0'
    | '1.6.0'
    | '1.8.0'
    | '3.0.0'
    | '3.0.1'
    | '3.3.0'
    | '3.5.0'
    | '4.0.0'
    | '4.0.1'
  >;
  /* Business version of the implementation guide */
  version?: string;
  /* Name for this implementation guide (human friendly) */
  title?: string;
  jurisdiction?: CodeableConcept;
  /* Information about an assembled IG */
  manifest?: {
    _other?: Element;
    /* Location of rendered implementation guide */
    rendering?: url;
    image?: string;
    other?: string;
    resource: {
      _relativePath?: Element;
      /* Relative path for page in IG */
      relativePath?: url;
      /* Location of the resource */
      reference: Reference<'Reference'>;
      /* Is an example/What is this an example of? */
      example?: {
        canonical?: canonical;
        boolean?: boolean;
        _boolean?: Element;
        _canonical?: Element;
      };
    };
    page?: {
      /* Title of the page, for references */
      title?: string;
      _anchor?: Element;
      _title?: Element;
      anchor?: string;
      _name?: Element;
      /* HTML page name */
      name: string;
    };
    _image?: Element;
    _rendering?: Element;
  };
  useContext?: UsageContext;
  _status?: Element;
  dependsOn?: {
    /* Identity of the IG that this depends on */
    uri: canonical;
    /* Version of the IG */
    version?: string;
    _version?: Element;
    _uri?: Element;
    /* NPM Package name for IG this depends on */
    packageId?: id;
    _packageId?: Element;
  };
  _version?: Element;
  _experimental?: Element;
  contact?: ContactDetail;
  _copyright?: Element;
  _url?: Element;
  /* Natural language description of the implementation guide */
  description?: markdown;
  /* SPDX license code for this IG (or not-open-source) */
  license?:
    | '0BSD'
    | 'AAL'
    | 'Abstyles'
    | 'Adobe-2006'
    | 'Adobe-Glyph'
    | 'ADSL'
    | 'AFL-1.1'
    | 'AFL-1.2'
    | 'AFL-2.0'
    | 'AFL-2.1'
    | 'AFL-3.0'
    | 'Afmparse'
    | 'AGPL-1.0-only'
    | 'AGPL-1.0-or-later'
    | 'AGPL-3.0-only'
    | 'AGPL-3.0-or-later'
    | 'Aladdin'
    | 'AMDPLPA'
    | 'AML'
    | 'AMPAS'
    | 'ANTLR-PD'
    | 'Apache-1.0'
    | 'Apache-1.1'
    | 'Apache-2.0'
    | 'APAFML'
    | 'APL-1.0'
    | 'APSL-1.0'
    | 'APSL-1.1'
    | 'APSL-1.2'
    | 'APSL-2.0'
    | 'Artistic-1.0'
    | 'Artistic-1.0-cl8'
    | 'Artistic-1.0-Perl'
    | 'Artistic-2.0'
    | 'Bahyph'
    | 'Barr'
    | 'Beerware'
    | 'BitTorrent-1.0'
    | 'BitTorrent-1.1'
    | 'Borceux'
    | 'BSD-1-Clause'
    | 'BSD-2-Clause'
    | 'BSD-2-Clause-FreeBSD'
    | 'BSD-2-Clause-NetBSD'
    | 'BSD-2-Clause-Patent'
    | 'BSD-3-Clause'
    | 'BSD-3-Clause-Attribution'
    | 'BSD-3-Clause-Clear'
    | 'BSD-3-Clause-LBNL'
    | 'BSD-3-Clause-No-Nuclear-License'
    | 'BSD-3-Clause-No-Nuclear-License-2014'
    | 'BSD-3-Clause-No-Nuclear-Warranty'
    | 'BSD-4-Clause'
    | 'BSD-4-Clause-UC'
    | 'BSD-Protection'
    | 'BSD-Source-Code'
    | 'BSL-1.0'
    | 'bzip2-1.0.5'
    | 'bzip2-1.0.6'
    | 'Caldera'
    | 'CATOSL-1.1'
    | 'CC0-1.0'
    | 'CC-BY-1.0'
    | 'CC-BY-2.0'
    | 'CC-BY-2.5'
    | 'CC-BY-3.0'
    | 'CC-BY-4.0'
    | 'CC-BY-NC-1.0'
    | 'CC-BY-NC-2.0'
    | 'CC-BY-NC-2.5'
    | 'CC-BY-NC-3.0'
    | 'CC-BY-NC-4.0'
    | 'CC-BY-NC-ND-1.0'
    | 'CC-BY-NC-ND-2.0'
    | 'CC-BY-NC-ND-2.5'
    | 'CC-BY-NC-ND-3.0'
    | 'CC-BY-NC-ND-4.0'
    | 'CC-BY-NC-SA-1.0'
    | 'CC-BY-NC-SA-2.0'
    | 'CC-BY-NC-SA-2.5'
    | 'CC-BY-NC-SA-3.0'
    | 'CC-BY-NC-SA-4.0'
    | 'CC-BY-ND-1.0'
    | 'CC-BY-ND-2.0'
    | 'CC-BY-ND-2.5'
    | 'CC-BY-ND-3.0'
    | 'CC-BY-ND-4.0'
    | 'CC-BY-SA-1.0'
    | 'CC-BY-SA-2.0'
    | 'CC-BY-SA-2.5'
    | 'CC-BY-SA-3.0'
    | 'CC-BY-SA-4.0'
    | 'CDDL-1.0'
    | 'CDDL-1.1'
    | 'CDLA-Permissive-1.0'
    | 'CDLA-Sharing-1.0'
    | 'CECILL-1.0'
    | 'CECILL-1.1'
    | 'CECILL-2.0'
    | 'CECILL-2.1';
}

export type RPCgetAppointments = {
  method: 'relatient.scheduling/get-appointments';
  params: {
    [key: string]: any;
  };
};
export type RPCgetAccounts = {
  method: 'dash.demo/get-accounts';
  params: {};
};
export interface EliminateRule extends Resource<'EliminateRule'> {
  [key: string]: any;
}

/* The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */
export interface RiskEvidenceSynthesis extends DomainResource, Resource<'RiskEvidenceSynthesis'> {
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  _date?: Element;
  /* What was the estimated risk */
  riskEstimate?: {
    /* Type of risk estimate */
    'type'?: CodeableConcept;
    _description?: Element;
    /* Number with the outcome */
    numeratorCount?: integer;
    _value?: Element;
    /* Sample size for group measured */
    denominatorCount?: integer;
    /* What unit is the outcome described in? */
    unitOfMeasure?:
      | 'N'
      | 'h'
      | 'H'
      | '{HaTiter}'
      | '{HA_titer}'
      | '%{Hb}'
      | '[hd_i]'
      | '%{Hemoglobin}'
      | '%{HemoglobinA1C}'
      | '%{HemoglobinSaturation}'
      | '%{hemolysis}'
      | '%{Hemolysis}'
      | 'hL'
      | "[hnsf'U]"
      | '[HP]'
      | '[hp_C]'
      | '/[HPF]'
      | '{#}/[HPF]'
      | '[hp_M]'
      | '[hp_Q]'
      | '[hp_X]'
      | '%{HumanResponse}'
      | 'Hz'
      | '{IfaIndex}'
      | '{IFA_index}'
      | '{IfaTiter}'
      | '{IFA_titer}'
      | "{IgAAntiphosphatidyleserine'U}"
      | "{IgAPhospholipid'U}"
      | "{IgGAntiphosphatidyleserine'U}"
      | '{IgGIndex}'
      | "{IgMAntiphosphatidyleserine'U}"
      | '{IgMIndex}'
      | "{ImmuneComplex'U}"
      | '{ImmuneStatusRatio}'
      | '{Immunity}'
      | '[in_br]'
      | '%{index}'
      | '{index}'
      | '%{Index}'
      | '{index_val}'
      | '{Index_val}'
      | '{IndexValue}'
      | '{InhaledTobaccoUseAmountYears}'
      | 'g/L'
      | '{InhaledTobaccoUsePacks}/d'
      | '%{inhibition}'
      | '%{Inhibition}'
      | '[in_i]'
      | "[in_i'H2O]"
      | "[in_i'Hg]"
      | '{INR}'
      | "{INR'unit}"
      | '[in_us]'
      | '{ISR}'
      | '/[iU]'
      | '[iU]'
      | '/[IU]'
      | '[IU]'
      | '[IU]/10*9{RBCs}'
      | '[HPF]'
      | '[IU]/(24.h)'
      | '[IU]/(2.h)'
      | '[IU]/d'
      | '[iU]/dL'
      | '[IU]/dL'
      | '[iU]/g'
      | '[IU]/g{Hb}'
      | '[iU]/g{Hgb}'
      | '[IU]/h'
      | '[iU]/kg'
      | '[IU]/kg'
      | '[IU]/kg/d'
      | '[iU]/L'
      | '[IU]/L'
      | '[IU]/L{37Cel}'
      | '[IU]/mg{creat}'
      | '[IU]/min'
      | '[iU]/mL'
      | '[IU]/mL'
      | "{JDF'U}"
      | "{JDF'U}/L"
      | 'J/L'
      | "{JuvenileDiabetesFound'U}"
      | '[k]'
      | 'K'
      | 'kat'
      | 'kat/kg'
      | 'kat/L'
      | "[ka'U]"
      | 'kBq'
      | 'kcal/(8.h)'
      | 'kcal/d'
      | 'kcal/h'
      | 'kcal/kg/(24.h)'
      | 'kcal/[oz_av]'
      | "{KCT'U}"
      | '/kg'
      | 'kg'
      | "/kg{body'wt}";
    /* Description of risk estimate */
    description?: string;
    _numeratorCount?: Element;
    precisionEstimate?: {
      _to?: Element;
      _level?: Element;
      /* Type of precision estimate */
      'type'?: CodeableConcept;
      /* Lower bound */
      from?: decimal;
      _from?: Element;
      /* Level of confidence interval */
      level?: decimal;
      /* Upper bound */
      to?: decimal;
    };
    /* Point estimate */
    value?: decimal;
    _denominatorCount?: Element;
  };
  /* When the risk evidence synthesis was last reviewed */
  lastReviewDate?: date;
  /* Natural language description of the risk evidence synthesis */
  description?: markdown;
  _publisher?: Element;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Name for this risk evidence synthesis (human friendly) */
  title?: string;
  _version?: Element;
  useContext?: UsageContext;
  _title?: Element;
  contact?: ContactDetail;
  reviewer?: ContactDetail;
  identifier?: Identifier;
  _name?: Element;
  author?: ContactDetail;
  _copyright?: Element;
  /* What sample size was involved? */
  sampleSize?: {
    _numberOfParticipants?: Element;
    _description?: Element;
    /* How many participants? */
    numberOfParticipants?: integer;
    /* Description of sample size */
    description?: string;
    _numberOfStudies?: Element;
    /* How many studies? */
    numberOfStudies?: integer;
  };
  /* Business version of the risk evidence synthesis */
  version?: string;
  _url?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* What exposure? */
  exposure?: Reference<'EvidenceVariable'>;
  /* Type of synthesis */
  synthesisType?: CodeableConcept;
  endorser?: ContactDetail;
  _approvalDate?: Element;
  _description?: Element;
  editor?: ContactDetail;
  /* What outcome? */
  outcome: Reference<'EvidenceVariable'>;
  /* Name for this risk evidence synthesis (computer friendly) */
  name?: string;
  relatedArtifact?: RelatedArtifact;
  _lastReviewDate?: Element;
  /* Type of study */
  studyType?: CodeableConcept;
  note?: Annotation;
  topic?: CodeableConcept;
  /* Canonical identifier for this risk evidence synthesis, represented as a URI (globally unique) */
  url?: uri;
  certainty?: {
    note?: Annotation;
    certaintySubcomponent?: {
      /* Type of subcomponent of certainty rating */
      'type'?: CodeableConcept;
      note?: Annotation;
      rating?: CodeableConcept;
    };
    rating?: CodeableConcept;
  };
  /* When the risk evidence synthesis is expected to be used */
  effectivePeriod?: Period;
  _status?: Element;
  /* What population? */
  population: Reference<'EvidenceVariable'>;
  jurisdiction?: CodeableConcept;
  /* When the risk evidence synthesis was approved by publisher */
  approvalDate?: date;
  /* Date last changed */
  date?: dateTime;
}

/* Mark that an invariant represents 'best practice' rule - a rule that implementers may choose to enforce at error level in some or all circumstances. */
export interface elementdefinitionBestpractice {
  CodeableConcept?: CodeableConcept;
  boolean?: boolean;
}

export type RPCgenerateSlots = {
  method: 'relatient.pmsystem/generate-slots';
  params: {
    location: string;
    period?: {
      end: date;
      start?: date;
    };
    practitioner: string;
    account: string;
    schedule?: {
      start?: {
        /* only hours (e.g. 12) */
        hour?: number;
        min?: number;
      };
      'days-of-week': any;
      'appt-types': any;
      interval?: number;
    };
  };
};
/* The ResearchElementDefinition resource describes a "PICO" element that knowledge (evidence, assertion, recommendation) is about. */
export interface ResearchElementDefinition extends DomainResource, Resource<'ResearchElementDefinition'> {
  _subtitle?: Element;
  _name?: Element;
  editor?: ContactDetail;
  /* Business version of the research element definition */
  version?: string;
  library?: canonical;
  /* E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device */
  subject?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Group'>;
  };
  _status?: Element;
  _copyright?: Element;
  _publisher?: Element;
  characteristic: {
    /* What time period does the study cover */
    studyEffectiveDescription?: string;
    /* What time period do participants cover */
    participantEffective?: {
      Duration?: Duration;
      Timing?: Timing;
      _dateTime?: Element;
      Period?: Period;
      dateTime?: dateTime;
    };
    _studyEffectiveDescription?: Element;
    _studyEffectiveGroupMeasure?: Element;
    /* Observation time from study start */
    studyEffectiveTimeFromStart?: Duration;
    /* mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median */
    studyEffectiveGroupMeasure?:
      | 'mean'
      | 'mean-of-mean'
      | 'mean-of-median'
      | 'median'
      | 'median-of-mean'
      | 'median-of-median';
    _participantEffectiveDescription?: Element;
    usageContext?: UsageContext;
    /* Whether the characteristic includes or excludes members */
    exclude?: boolean;
    /* What time period do participants cover */
    participantEffectiveDescription?: string;
    /* Observation time from study start */
    participantEffectiveTimeFromStart?: Duration;
    _exclude?: Element;
    /* What code or expression defines members? */
    definition?: {
      _canonical?: Element;
      CodeableConcept?: CodeableConcept;
      Expression?: Expression;
      DataRequirement?: DataRequirement;
      canonical?: canonical;
    };
    /* mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median */
    participantEffectiveGroupMeasure?:
      | 'mean'
      | 'mean-of-mean'
      | 'mean-of-median'
      | 'median'
      | 'median-of-mean'
      | 'median-of-median';
    /* What unit is the outcome described in? */
    unitOfMeasure?:
      | 'N'
      | 'h'
      | 'H'
      | '{HaTiter}'
      | '{HA_titer}'
      | '%{Hb}'
      | '[hd_i]'
      | '%{Hemoglobin}'
      | '%{HemoglobinA1C}'
      | '%{HemoglobinSaturation}'
      | '%{hemolysis}'
      | '%{Hemolysis}'
      | 'hL'
      | "[hnsf'U]"
      | '[HP]'
      | '[hp_C]'
      | '/[HPF]'
      | '{#}/[HPF]'
      | '[hp_M]'
      | '[hp_Q]'
      | '[hp_X]'
      | '%{HumanResponse}'
      | 'Hz'
      | '{IfaIndex}'
      | '{IFA_index}'
      | '{IfaTiter}'
      | '{IFA_titer}'
      | "{IgAAntiphosphatidyleserine'U}"
      | "{IgAPhospholipid'U}"
      | "{IgGAntiphosphatidyleserine'U}"
      | '{IgGIndex}'
      | "{IgMAntiphosphatidyleserine'U}"
      | '{IgMIndex}'
      | "{ImmuneComplex'U}"
      | '{ImmuneStatusRatio}'
      | '{Immunity}'
      | '[in_br]'
      | '%{index}'
      | '{index}'
      | '%{Index}'
      | '{index_val}'
      | '{Index_val}'
      | '{IndexValue}'
      | '{InhaledTobaccoUseAmountYears}'
      | 'g/L'
      | '{InhaledTobaccoUsePacks}/d'
      | '%{inhibition}'
      | '%{Inhibition}'
      | '[in_i]'
      | "[in_i'H2O]"
      | "[in_i'Hg]"
      | '{INR}'
      | "{INR'unit}"
      | '[in_us]'
      | '{ISR}'
      | '/[iU]'
      | '[iU]'
      | '/[IU]'
      | '[IU]'
      | '[IU]/10*9{RBCs}'
      | '[HPF]'
      | '[IU]/(24.h)'
      | '[IU]/(2.h)'
      | '[IU]/d'
      | '[iU]/dL'
      | '[IU]/dL'
      | '[iU]/g'
      | '[IU]/g{Hb}'
      | '[iU]/g{Hgb}'
      | '[IU]/h'
      | '[iU]/kg'
      | '[IU]/kg'
      | '[IU]/kg/d'
      | '[iU]/L'
      | '[IU]/L'
      | '[IU]/L{37Cel}'
      | '[IU]/mg{creat}'
      | '[IU]/min'
      | '[iU]/mL'
      | '[IU]/mL'
      | "{JDF'U}"
      | "{JDF'U}/L"
      | 'J/L'
      | "{JuvenileDiabetesFound'U}"
      | '[k]'
      | 'K'
      | 'kat'
      | 'kat/kg'
      | 'kat/L'
      | "[ka'U]"
      | 'kBq'
      | 'kcal/(8.h)'
      | 'kcal/d'
      | 'kcal/h'
      | 'kcal/kg/(24.h)'
      | 'kcal/[oz_av]'
      | "{KCT'U}"
      | '/kg'
      | 'kg'
      | "/kg{body'wt}";
    /* What time period does the study cover */
    studyEffective?: {
      _dateTime?: Element;
      dateTime?: dateTime;
      Duration?: Duration;
      Timing?: Timing;
      Period?: Period;
    };
    _participantEffectiveGroupMeasure?: Element;
  };
  _usage?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* Natural language description of the research element definition */
  description?: markdown;
  _comment?: Element;
  /* When the research element definition was last reviewed */
  lastReviewDate?: date;
  _experimental?: Element;
  /* When the research element definition is expected to be used */
  effectivePeriod?: Period;
  endorser?: ContactDetail;
  _date?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  relatedArtifact?: RelatedArtifact;
  /* Describes the clinical usage of the ResearchElementDefinition */
  usage?: string;
  comment?: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _approvalDate?: Element;
  jurisdiction?: CodeableConcept;
  contact?: ContactDetail;
  _version?: Element;
  /* Canonical identifier for this research element definition, represented as a URI (globally unique) */
  url?: uri;
  useContext?: UsageContext;
  author?: ContactDetail;
  topic?: CodeableConcept;
  /* dichotomous | continuous | descriptive */
  variableType?: 'continuous' | 'descriptive' | 'dichotomous';
  /* For testing purposes, not real usage */
  experimental?: boolean;
  /* Name for this research element definition (human friendly) */
  title?: string;
  _type?: Element;
  /* Name for this research element definition (computer friendly) */
  name?: string;
  /* Subordinate title of the ResearchElementDefinition */
  subtitle?: string;
  /* Date last changed */
  date?: dateTime;
  _purpose?: Element;
  identifier?: Identifier;
  /* Title for use in informal contexts */
  shortTitle?: string;
  /* population | exposure | outcome */
  'type': 'exposure' | 'outcome' | 'population';
  _library?: Element;
  _lastReviewDate?: Element;
  _url?: Element;
  _title?: Element;
  _description?: Element;
  _variableType?: Element;
  /* When the research element definition was approved by publisher */
  approvalDate?: date;
  _shortTitle?: Element;
  /* Why this research element definition is defined */
  purpose?: markdown;
  reviewer?: ContactDetail;
}

export interface PmSystem extends Resource<'PmSystem'> {
  name: string;
  systemAccount: Reference<'SystemAccount'>;
  url: string;
  system: string;
  configuration?: {
    athena?: {
      'practice-id': string;
      'oauth-url': string;
      'client-secret': string;
      'client-id': string;
      'base-url': string;
      scope: string;
    };
  };
  externalId: string;
  organization: Reference<'Organization'>;
  'type'?: string;
}

/* Logical Model: Who What When Where Why - Common pattern for all resources that deals with attribution. */
export type FiveWs = any;
export interface EmailSchedule extends Resource<'EmailSchedule'> {
  day?: Array<string>;
  reportFormats?: {
    'type': 'full' | 'partial';
    enabled: boolean;
    format: 'PDF' | 'CSV';
  };
  time?: string;
  recipients?: Array<string>;
  systemAccount?: Reference<'SystemAccount'>;
  'type'?:
    | 'appointment-reminder'
    | 'appointment-notification'
    | 'appointment-noshow'
    | 'appointment-alert'
    | 'recall'
    | 'broadcast';
  name?: string;
  timezone?: string;
}

/* Base StructureDefinition for Attachment Type: For referring to data content defined in other formats. */
export interface Attachment extends Element {
  _data?: Element;
  /* Uri where the data can be found */
  url?: url;
  /* Label to display in place of the data */
  title?: string;
  /* Number of bytes of content (if url provided) */
  size?: unsignedInt;
  /* Mime type of the content, with charset etc. */
  contentType?: 'application/hl7-cda+xml';
  /* Hash of the data (sha-1, base64ed) */
  hash?: base64Binary;
  _contentType?: Element;
  _url?: Element;
  _title?: Element;
  /* Human language of the content (BCP-47) */
  language?:
    | 'ar'
    | 'bn'
    | 'cs'
    | 'da'
    | 'de'
    | 'de-AT'
    | 'de-CH'
    | 'de-DE'
    | 'el'
    | 'en'
    | 'en-AU'
    | 'en-CA'
    | 'en-GB'
    | 'en-IN'
    | 'en-NZ'
    | 'en-SG'
    | 'en-US'
    | 'es'
    | 'es-AR'
    | 'es-ES'
    | 'es-UY'
    | 'fi'
    | 'fr'
    | 'fr-BE'
    | 'fr-CH'
    | 'fr-FR'
    | 'fy'
    | 'fy-NL'
    | 'hi'
    | 'hr'
    | 'it'
    | 'it-CH'
    | 'it-IT'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'nl-BE'
    | 'nl-NL'
    | 'no'
    | 'no-NO'
    | 'pa'
    | 'pl'
    | 'pt'
    | 'pt-BR'
    | 'ru'
    | 'ru-RU'
    | 'sr'
    | 'sr-RS'
    | 'sv'
    | 'sv-SE'
    | 'te'
    | 'zh'
    | 'zh-CN'
    | 'zh-HK'
    | 'zh-SG'
    | 'zh-TW';
  /* Data inline, base64ed */
  data?: base64Binary;
  _size?: Element;
  _hash?: Element;
  _creation?: Element;
  _language?: Element;
  /* Date attachment was first created */
  creation?: dateTime;
}

export interface Singleton {
  [key: string]: any;
}

export type RPCgetCodesystem = {
  method: 'relatient.terminology/get-codesystem';
  params: {
    [key: string]: any;
  };
};
export type RPCgetDepartments = {
  method: 'relatient.pmsystem/get-departments';
  params: {
    'pm-id': string;
    account: string;
  };
};
/* Record of delivery of what is supplied. */
export interface SupplyDelivery extends DomainResource, Resource<'SupplyDelivery'> {
  identifier?: Identifier;
  /* When event occurred */
  occurrence?: {
    Period?: Period;
    Timing?: Timing;
    _dateTime?: Element;
    dateTime?: dateTime;
  };
  /* in-progress | completed | abandoned | entered-in-error */
  status?: 'abandoned' | 'completed' | 'entered-in-error' | 'in-progress';
  basedOn?: Array<Reference<'SupplyRequest'>>;
  /* Dispenser */
  supplier?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* Where the Supply was sent */
  destination?: Reference<'Location'>;
  /* Category of dispense event */
  'type'?: 'device' | 'medication';
  _status?: Element;
  receiver?: Array<Reference<'PractitionerRole' | 'Practitioner'>>;
  /* Patient for whom the item is supplied */
  patient?: Reference<'Patient'>;
  /* The item that is delivered or supplied */
  suppliedItem?: {
    /* Medication, Substance, or Device supplied */
    item?: {
      Reference?: Reference<'Medication' | 'Device' | 'Substance'>;
      CodeableConcept?: CodeableConcept;
    };
    /* Amount dispensed */
    quantity?: Quantity;
  };
  partOf?: Array<Reference<'SupplyDelivery' | 'Contract'>>;
}

/* Base StructureDefinition for Annotation Type: A  text note which also  contains information about who made the statement and when. */
export interface Annotation extends Element {
  /* The annotation  - text content (as markdown) */
  text: markdown;
  /* When the annotation was made */
  time?: dateTime;
  /* Individual responsible for the annotation */
  author?: {
    _string?: Element;
    string?: string;
    Reference?: Reference<'Patient' | 'Organization' | 'Practitioner' | 'RelatedPerson'>;
  };
  _time?: Element;
  _text?: Element;
}

/* Defines an affiliation/assotiation/relationship between 2 distinct oganizations, that is not a part-of relationship/sub-division relationship. */
export interface OrganizationAffiliation extends DomainResource, Resource<'OrganizationAffiliation'> {
  code?: CodeableConcept;
  endpoint?: Array<Reference<'Endpoint'>>;
  location?: Array<Reference<'Location'>>;
  network?: Array<Reference<'Organization'>>;
  _active?: Element;
  healthcareService?: Array<Reference<'HealthcareService'>>;
  /* Organization where the role is available */
  organization?: Reference<'Organization'>;
  /* Organization that provides/performs the role (e.g. providing services or is a member of) */
  participatingOrganization?: Reference<'Organization'>;
  specialty?: Array<CodeableConcept>;
  telecom?: ContactPoint;
  identifier?: Identifier;
  /* The period during which the participatingOrganization is affiliated with the primary organization */
  period?: Period;
  /* Whether this organization affiliation record is in active use */
  active?: boolean;
}

/* Base StructureDefinition for ParameterDefinition Type: The parameters to the module. This collection specifies both the input and output parameters. Input parameters are provided by the caller as part of the $evaluate operation. Output parameters are included in the GuidanceResponse. */
export interface ParameterDefinition extends Element {
  _documentation?: Element;
  _name?: Element;
  /* Minimum cardinality */
  min?: integer;
  _max?: Element;
  _min?: Element;
  _use?: Element;
  _profile?: Element;
  _type?: Element;
  /* Name used to access the parameter value */
  name?: code;
  /* Maximum cardinality (a number of *) */
  max?: string;
  /* A brief description of the parameter */
  documentation?: string;
  /* What profile the value is expected to be */
  profile?: canonical;
  /* What type of value */
  'type':
    | 'Any'
    | 'Type'
    | 'Address'
    | 'Age'
    | 'Annotation'
    | 'Attachment'
    | 'BackboneElement'
    | 'base64Binary'
    | 'boolean'
    | 'canonical'
    | 'code'
    | 'CodeableConcept'
    | 'Coding'
    | 'ContactDetail'
    | 'ContactPoint'
    | 'Contributor'
    | 'Count'
    | 'DataRequirement'
    | 'date'
    | 'dateTime'
    | 'decimal'
    | 'Distance'
    | 'Dosage'
    | 'Duration'
    | 'Element'
    | 'ElementDefinition'
    | 'Expression'
    | 'Extension'
    | 'HumanName'
    | 'id'
    | 'Identifier'
    | 'instant'
    | 'integer'
    | 'markdown'
    | 'MarketingStatus'
    | 'Meta'
    | 'Money'
    | 'MoneyQuantity'
    | 'Narrative'
    | 'oid'
    | 'ParameterDefinition'
    | 'Period'
    | 'Population'
    | 'positiveInt'
    | 'ProdCharacteristic'
    | 'ProductShelfLife'
    | 'Quantity'
    | 'Range'
    | 'Ratio'
    | 'Reference'
    | 'RelatedArtifact'
    | 'SampledData'
    | 'Signature'
    | 'string'
    | 'SubstanceAmount'
    | 'time'
    | 'Timing'
    | 'TriggerDefinition'
    | 'unsignedInt'
    | 'uri'
    | 'url'
    | 'UsageContext'
    | 'uuid'
    | 'xhtml'
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition';
  /* in | out */
  use: 'in' | 'out';
}

/* A fixed quantity (no comparator) */
export interface Quantity extends Element {
  _unit?: Element;
  _comparator?: Element;
  _system?: Element;
  /* System that defines coded unit form */
  system?: uri;
  _code?: Element;
  comparator?: code;
  /* Unit representation */
  unit?: string;
  /* Coded form of the unit */
  code?: code;
  /* Numerical value (with implicit precision) */
  value?: decimal;
  _value?: Element;
}

/* A set of codes that defines what the server is capable of. */
export type capabilities =
  | 'client-confidential-symmetric'
  | 'client-public'
  | 'context-ehr-encounter'
  | 'context-ehr-patient'
  | 'context-passthrough-banner'
  | 'context-passthrough-style'
  | 'context-standalone-encounter'
  | 'context-standalone-patient'
  | 'launch-ehr'
  | 'launch-standalone'
  | 'permission-offline'
  | 'permission-patient'
  | 'permission-user'
  | 'sso-openid-connect';
/* Base StructureDefinition for Extension Type: Optional Extension Element - found in all resources. */
export interface Extension extends Element {
  /* identifies the meaning of the extension */
  url: uri;
  /* Value of extension */
  value?: {
    integer?: integer;
    RelatedArtifact?: RelatedArtifact;
    Identifier?: Identifier;
    uri?: uri;
    CodeableConcept?: CodeableConcept;
    ParameterDefinition?: ParameterDefinition;
    DataRequirement?: DataRequirement;
    Quantity?: Quantity;
    id?: id;
    unsignedInt?: unsignedInt;
    dateTime?: dateTime;
    decimal?: decimal;
    Distance?: Distance;
    ContactPoint?: ContactPoint;
    UsageContext?: UsageContext;
    boolean?: boolean;
    positiveInt?: positiveInt;
    Age?: Age;
    Attachment?: Attachment;
    Meta?: Meta;
    base64Binary?: base64Binary;
    Contributor?: Contributor;
    Ratio?: Ratio;
    Expression?: Expression;
    Reference?: Reference<'Reference'>;
    url?: url;
    Dosage?: Dosage;
    Range?: Range;
    SampledData?: SampledData;
    Money?: Money;
    HumanName?: HumanName;
    Signature?: Signature;
    Coding?: Coding;
    Timing?: Timing;
    code?: code;
    Count?: Count;
    Address?: Address;
    ContactDetail?: ContactDetail;
    Annotation?: Annotation;
    TriggerDefinition?: TriggerDefinition;
    canonical?: canonical;
    instant?: instant;
    Period?: Period;
    markdown?: markdown;
    Duration?: Duration;
    oid?: oid;
    string?: string;
    time?: time;
    uuid?: uuid;
    date?: date;
  };
}

/* The inclusive lower bound on the range of allowed values for the data element. */
export interface minValue {
  date?: date;
  integer?: integer;
  dateTime?: dateTime;
  decimal?: decimal;
  time?: time;
}

export interface AppointmentRequest extends Resource<'AppointmentRequest'> {
  [key: string]: any;
}

/* This resource provides the status of the payment for goods and services rendered, and the request and response resource references. */
export interface PaymentNotice extends DomainResource, Resource<'PaymentNotice'> {
  identifier?: Identifier;
  /* Responsible practitioner */
  provider?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* Party being notified */
  recipient: Reference<'Organization'>;
  /* Monetary amount of the payment */
  amount: Money;
  /* Payment reference */
  payment: Reference<'PaymentReconciliation'>;
  /* Payment or clearing date */
  paymentDate?: date;
  _status?: Element;
  /* Request reference */
  request?: Reference<'Reference'>;
  /* Party being paid */
  payee?: Reference<'PractitionerRole' | 'Practitioner' | 'Organization'>;
  _created?: Element;
  /* Creation date */
  created: dateTime;
  /* Response reference */
  response?: Reference<'Reference'>;
  _paymentDate?: Element;
  /* Issued or cleared Status of the payment */
  paymentStatus?: CodeableConcept;
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
}

/* Base StructureDefinition for positiveInt type: An integer with a value that is positive (e.g. >0) */
export type positiveInt = number;
export type RPCresetSyncStatus = {
  method: 'dash.account/reset-sync-status';
  params: {
    account: string;
  };
};
/* Base StructureDefinition for Identifier Type: An identifier - identifies some entity uniquely and unambiguously. Typically this is used for business identifiers. */
export interface Identifier extends Element {
  /* Organization that issued id (may be just text) */
  assigner?: Reference<'Organization'>;
  /* Time period when id is/was valid for use */
  period?: Period;
  /* The value that is unique */
  value?: string;
  _system?: Element;
  _use?: Element;
  /* The namespace for the identifier value */
  system?: uri;
  /* Description of identifier */
  'type'?: CodeableConcept;
  _value?: Element;
  /* usual | official | temp | secondary | old (If known) */
  use?: 'official' | 'old' | 'secondary' | 'temp' | 'usual';
}

/* Base StructureDefinition for uri Type: String of characters used to identify a name or a resource */
export type uri = string;
/* Representation of the content produced in a DICOM imaging study. A study comprises a set of series, each of which includes a set of Service-Object Pair Instances (SOP Instances - images or other data) acquired or produced in a common context.  A series is of only one modality (e.g. X-ray, CT, MR, ultrasound), but a study may have multiple series of different modalities. */
export interface ImagingStudy extends DomainResource, Resource<'ImagingStudy'> {
  /* Number of Study Related Instances */
  numberOfInstances?: unsignedInt;
  _numberOfSeries?: Element;
  identifier?: Identifier;
  _started?: Element;
  series?: {
    _uid?: Element;
    _numberOfInstances?: Element;
    endpoint?: Array<Reference<'Endpoint'>>;
    _started?: Element;
    performer?: {
      /* Who performed the series */
      actor: Reference<
        'CareTeam' | 'Practitioner' | 'Patient' | 'Organization' | 'PractitionerRole' | 'RelatedPerson' | 'Device'
      >;
      /* Type of performance */
      function?: CodeableConcept;
    };
    /* The modality of the instances in the series */
    modality: Coding;
    /* Body part examined */
    bodySite?: Coding;
    /* DICOM Series Instance UID for the series */
    uid: id;
    /* A short human readable summary of the series */
    description?: string;
    /* When the series started */
    started?: dateTime;
    specimen?: Array<Reference<'Specimen'>>;
    /* Numeric identifier of this series */
    number?: unsignedInt;
    _description?: Element;
    _number?: Element;
    /* Body part laterality */
    laterality?: Coding;
    instance?: {
      /* Description of instance */
      title?: string;
      _number?: Element;
      _uid?: Element;
      _title?: Element;
      /* DICOM SOP Instance UID */
      uid: id;
      /* The number of this instance in the series */
      number?: unsignedInt;
      /* DICOM class type */
      sopClass: Coding;
    };
    /* Number of Series Related Instances */
    numberOfInstances?: unsignedInt;
  };
  /* Institution-generated description */
  description?: string;
  /* registered | available | cancelled | entered-in-error | unknown */
  status: 'available' | 'cancelled' | 'entered-in-error' | 'registered' | 'unknown';
  /* The performed Procedure reference */
  procedureReference?: Reference<'Procedure'>;
  procedureCode?: CodeableConcept;
  endpoint?: Array<Reference<'Endpoint'>>;
  reasonReference?: Array<Reference<'Condition' | 'DocumentReference' | 'DiagnosticReport' | 'Observation' | 'Media'>>;
  _status?: Element;
  _description?: Element;
  /* Encounter with which this imaging study is associated */
  encounter?: Reference<'Encounter'>;
  interpreter?: Array<Reference<'PractitionerRole' | 'Practitioner'>>;
  /* Number of Study Related Series */
  numberOfSeries?: unsignedInt;
  basedOn?: Array<Reference<'ServiceRequest' | 'Task' | 'AppointmentResponse' | 'CarePlan' | 'Appointment'>>;
  /* Where ImagingStudy occurred */
  location?: Reference<'Location'>;
  reasonCode?: CodeableConcept;
  /* When the study was started */
  started?: dateTime;
  /* Who or what is the subject of the study */
  subject: Reference<'Group' | 'Device' | 'Patient'>;
  _numberOfInstances?: Element;
  /* Referring physician */
  referrer?: Reference<'PractitionerRole' | 'Practitioner'>;
  note?: Annotation;
  modality?: Coding;
}

export interface filterCriteria extends baseFilter {
  and?: filterCriteria & baseFilter;
  or?: filterCriteria & baseFilter;
}

export interface CustomAttribute extends Resource<'CustomAttribute'> {
  [key: string]: any;
}

export type RPCcancelAppt = {
  method: 'rpc.elastic/cancel-appt';
  params: {
    [key: string]: any;
  };
};
/* Store recall list from client */
export interface Recall extends Resource<'Recall'> {
  patient: Reference<'Patient'>;
  practitionerRole?: Reference<'PractitionerRole'>;
  /* Store technical information */
  metadata?: {
    status?: 'complete' | 'in-progress' | 'skip' | 'fail';
    /* Additional data by campaign */
    campaigns?: {
      /* Campaign definition */
      definition?: string;
      /* Workflow ID in conductor */
      workflow?: string;
      campaign?: Reference<'Campaign'>;
      status?: 'in-progress' | 'success' | 'error';
    };
    skipReason?: string;
  };
  start: instant;
  identifier: Identifier;
  location?: Reference<'Location'>;
  organization: Reference<'Organization'>;
  systemAccount: Reference<'SystemAccount'>;
}

/* Language translation from base language of resource to another language. */
export interface translation {
  /* Code for Language */
  lang:
    | 'ar'
    | 'bn'
    | 'cs'
    | 'da'
    | 'de'
    | 'de-AT'
    | 'de-CH'
    | 'de-DE'
    | 'el'
    | 'en'
    | 'en-AU'
    | 'en-CA'
    | 'en-GB'
    | 'en-IN'
    | 'en-NZ'
    | 'en-SG'
    | 'en-US'
    | 'es'
    | 'es-AR'
    | 'es-ES'
    | 'es-UY'
    | 'fi'
    | 'fr'
    | 'fr-BE'
    | 'fr-CH'
    | 'fr-FR'
    | 'fy'
    | 'fy-NL'
    | 'hi'
    | 'hr'
    | 'it'
    | 'it-CH'
    | 'it-IT'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'nl-BE'
    | 'nl-NL'
    | 'no'
    | 'no-NO'
    | 'pa'
    | 'pl'
    | 'pt'
    | 'pt-BR'
    | 'ru'
    | 'ru-RU'
    | 'sr'
    | 'sr-RS'
    | 'sv'
    | 'sv-SE'
    | 'te'
    | 'zh'
    | 'zh-CN'
    | 'zh-HK'
    | 'zh-SG'
    | 'zh-TW';
  /* Content in other Language */
  content?: {
    string?: string;
    markdown?: markdown;
  };
}

/* Allele information. */
export interface observationGeneticsAllele {
  /* Allele frequency */
  Frequency?: decimal;
  /* Name of allele */
  Name?: 'CodeableConcept';
  /* The level of occurrence of a single DNA sequence variant within a set of chromosomes: Heteroplasmic / Homoplasmic / Homozygous / Heterozygous / Hemizygous */
  State?: CodeableConcept;
}

/* A provider issued list of professional services and products which have been provided, or are to be provided, to a patient which is sent to an insurer for reimbursement. */
export interface Claim extends DomainResource, Resource<'Claim'> {
  procedure?: {
    _sequence?: Element;
    _date?: Element;
    /* When the procedure was performed */
    date?: dateTime;
    /* Procedure instance identifier */
    sequence: positiveInt;
    /* Specific clinical procedure */
    procedure?: {
      Reference?: Reference<'Procedure'>;
      CodeableConcept?: CodeableConcept;
    };
    'type'?: CodeableConcept;
    udi?: Array<Reference<'Device'>>;
  };
  /* Target */
  insurer?: Reference<'Organization'>;
  _use?: Element;
  diagnosis?: {
    'type'?: CodeableConcept;
    /* Present on admission */
    onAdmission?: CodeableConcept;
    _sequence?: Element;
    /* Package billing code */
    packageCode?: CodeableConcept;
    /* Nature of illness or problem */
    diagnosis?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Condition'>;
    };
    /* Diagnosis instance identifier */
    sequence: positiveInt;
  };
  /* The recipient of the products and services */
  patient: Reference<'Patient'>;
  /* Relevant time frame for the claim */
  billablePeriod?: Period;
  /* Recipient of benefits payable */
  payee?: {
    /* Category of recipient */
    'type': CodeableConcept;
    /* Recipient reference */
    party?: Reference<'PractitionerRole' | 'Practitioner' | 'RelatedPerson' | 'Organization' | 'Patient'>;
  };
  /* Author of the claim */
  enterer?: Reference<'PractitionerRole' | 'Practitioner'>;
  _status?: Element;
  /* Desired processing ugency */
  priority: CodeableConcept;
  /* More granular claim type */
  subType?: CodeableConcept;
  /* Prescription authorizing services and products */
  prescription?: Reference<'VisionPrescription' | 'MedicationRequest' | 'DeviceRequest'>;
  /* Details of the event */
  accident?: {
    /* Where the event occurred */
    location?: {
      Address?: Address;
      Reference?: Reference<'Location'>;
    };
    /* The nature of the accident */
    'type'?: CodeableConcept;
    /* When the incident occurred */
    date: date;
    _date?: Element;
  };
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  /* Category or discipline */
  'type': CodeableConcept;
  /* For whom to reserve funds */
  fundsReserve?: CodeableConcept;
  item?: {
    _sequence?: Element;
    /* Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    udi?: Array<Reference<'Device'>>;
    /* Price scaling factor */
    factor?: decimal;
    _careTeamSequence?: Element;
    detail?: {
      /* Billing, service, product, or drug code */
      productOrService: CodeableConcept;
      /* Total item cost */
      net?: Money;
      /* Count of products or services */
      quantity?: Quantity;
      /* Revenue or cost center code */
      revenue?: CodeableConcept;
      udi?: Array<Reference<'Device'>>;
      /* Item instance identifier */
      sequence: positiveInt;
      modifier?: CodeableConcept;
      programCode?: CodeableConcept;
      _sequence?: Element;
      /* Benefit classification */
      category?: CodeableConcept;
      /* Fee, charge or cost per item */
      unitPrice?: Money;
      subDetail?: {
        /* Fee, charge or cost per item */
        unitPrice?: Money;
        programCode?: CodeableConcept;
        /* Revenue or cost center code */
        revenue?: CodeableConcept;
        /* Price scaling factor */
        factor?: decimal;
        modifier?: CodeableConcept;
        /* Total item cost */
        net?: Money;
        /* Benefit classification */
        category?: CodeableConcept;
        /* Billing, service, product, or drug code */
        productOrService: CodeableConcept;
        _sequence?: Element;
        /* Count of products or services */
        quantity?: Quantity;
        /* Item instance identifier */
        sequence: positiveInt;
        _factor?: Element;
        udi?: Array<Reference<'Device'>>;
      };
      _factor?: Element;
      /* Price scaling factor */
      factor?: decimal;
    };
    diagnosisSequence?: positiveInt;
    _procedureSequence?: Element;
    _factor?: Element;
    /* Place of service or where product was supplied */
    location?: {
      CodeableConcept?: CodeableConcept;
      Address?: Address;
      Reference?: Reference<'Location'>;
    };
    procedureSequence?: positiveInt;
    /* Count of products or services */
    quantity?: Quantity;
    modifier?: CodeableConcept;
    /* Anatomical location */
    bodySite?: CodeableConcept;
    /* Revenue or cost center code */
    revenue?: CodeableConcept;
    /* Total item cost */
    net?: Money;
    /* Item instance identifier */
    sequence: positiveInt;
    /* Date or dates of service or product delivery */
    serviced?: {
      Period?: Period;
      date?: date;
      _date?: Element;
    };
    _diagnosisSequence?: Element;
    /* Benefit classification */
    category?: CodeableConcept;
    encounter?: Array<Reference<'Encounter'>>;
    informationSequence?: positiveInt;
    careTeamSequence?: positiveInt;
    programCode?: CodeableConcept;
    subSite?: CodeableConcept;
    /* Fee, charge or cost per item */
    unitPrice?: Money;
    _informationSequence?: Element;
  };
  /* Party responsible for the claim */
  provider: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* Original prescription if superseded by fulfiller */
  originalPrescription?: Reference<'VisionPrescription' | 'DeviceRequest' | 'MedicationRequest'>;
  /* Total claim cost */
  total?: Money;
  _created?: Element;
  supportingInfo?: {
    /* Information instance identifier */
    sequence: positiveInt;
    _sequence?: Element;
    /* Classification of the supplied information */
    category: CodeableConcept;
    /* When it occurred */
    timing?: {
      Period?: Period;
      _date?: Element;
      date?: date;
    };
    /* Type of information */
    code?: CodeableConcept;
    /* Explanation for the information */
    reason?: CodeableConcept;
    /* Data to be provided */
    value?: {
      boolean?: boolean;
      string?: string;
      Attachment?: Attachment;
      Quantity?: Quantity;
      _boolean?: Element;
      _string?: Element;
      Reference?: Reference<'Reference'>;
    };
  };
  /* Servicing facility */
  facility?: Reference<'Location'>;
  /* Treatment referral */
  referral?: Reference<'ServiceRequest'>;
  related?: {
    /* File or case reference */
    reference?: Identifier;
    /* How the reference claim is related */
    relationship?: CodeableConcept;
    /* Reference to the related claim */
    claim?: Reference<'Claim'>;
  };
  identifier?: Identifier;
  careTeam?: {
    /* Practitioner or organization */
    provider: Reference<'Practitioner' | 'Organization' | 'PractitionerRole'>;
    /* Indicator of the lead practitioner */
    responsible?: boolean;
    /* Practitioner credential or specialization */
    qualification?: CodeableConcept;
    /* Function within the team */
    role?: CodeableConcept;
    /* Order of care team */
    sequence: positiveInt;
    _responsible?: Element;
    _sequence?: Element;
  };
  /* claim | preauthorization | predetermination */
  use: 'claim' | 'preauthorization' | 'predetermination';
  insurance: {
    _focal?: Element;
    /* Insurance information */
    coverage: Reference<'Coverage'>;
    _preAuthRef?: Element;
    /* Adjudication results */
    claimResponse?: Reference<'ClaimResponse'>;
    /* Pre-assigned Claim number */
    identifier?: Identifier;
    _businessArrangement?: Element;
    /* Insurance instance identifier */
    sequence: positiveInt;
    preAuthRef?: string;
    /* Coverage to be used for adjudication */
    focal: boolean;
    _sequence?: Element;
    /* Additional provider contract number */
    businessArrangement?: string;
  };
  /* Resource creation date */
  created: dateTime;
}

/* A request to convey information; e.g. the CDS system proposes that an alert be sent to a responsible provider, the CDS system proposes that the public health agency be notified about a reportable condition. */
export interface CommunicationRequest extends DomainResource, Resource<'CommunicationRequest'> {
  /* Message sender */
  sender?: Reference<
    'Patient' | 'RelatedPerson' | 'Device' | 'HealthcareService' | 'PractitionerRole' | 'Organization' | 'Practitioner'
  >;
  basedOn?: Array<Reference<'Reference'>>;
  /* draft | active | on-hold | revoked | completed | entered-in-error | unknown */
  status: 'active' | 'completed' | 'draft' | 'entered-in-error' | 'on-hold' | 'revoked' | 'unknown';
  _priority?: Element;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  /* Reason for current status */
  statusReason?: CodeableConcept;
  _doNotPerform?: Element;
  payload?: {
    /* Message part content */
    content?: {
      string?: string;
      Reference?: Reference<'Reference'>;
      Attachment?: Attachment;
      _string?: Element;
    };
  };
  /* True if request is prohibiting action */
  doNotPerform?: boolean;
  recipient?: Array<
    Reference<
      | 'Device'
      | 'Organization'
      | 'Patient'
      | 'Group'
      | 'PractitionerRole'
      | 'HealthcareService'
      | 'Practitioner'
      | 'RelatedPerson'
      | 'CareTeam'
    >
  >;
  _authoredOn?: Element;
  about?: Array<Reference<'Reference'>>;
  identifier?: Identifier;
  /* When scheduled */
  occurrence?: {
    Period?: Period;
    _dateTime?: Element;
    dateTime?: dateTime;
  };
  _status?: Element;
  replaces?: Array<Reference<'CommunicationRequest'>>;
  /* Focus of message */
  subject?: Reference<'Patient' | 'Group'>;
  medium?: CodeableConcept;
  note?: Annotation;
  category?: CodeableConcept;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* When request transitioned to being actionable */
  authoredOn?: dateTime;
  /* Composite request this is part of */
  groupIdentifier?: Identifier;
  reasonReference?: Array<Reference<'DiagnosticReport' | 'DocumentReference' | 'Observation' | 'Condition'>>;
  /* Who/what is requesting service */
  requester?: Reference<'Device' | 'Practitioner' | 'Organization' | 'PractitionerRole' | 'RelatedPerson' | 'Patient'>;
  reasonCode?: CodeableConcept;
}

/* A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */
export interface CapabilityStatement extends DomainResource, Resource<'CapabilityStatement'> {
  _description?: Element;
  _name?: Element;
  imports?: canonical;
  _kind?: Element;
  /* Why this capability statement is defined */
  purpose?: markdown;
  _fhirVersion?: Element;
  document?: {
    /* Description of document support */
    documentation?: markdown;
    /* producer | consumer */
    mode: 'consumer' | 'producer';
    _documentation?: Element;
    _profile?: Element;
    _mode?: Element;
    /* Constraint on the resources used in the document */
    profile: canonical;
  };
  /* FHIR Version the system supports */
  fhirVersion:
    | '0.01'
    | '0.05'
    | '0.06'
    | '0.0.80'
    | '0.0.81'
    | '0.0.82'
    | '0.11'
    | '0.4.0'
    | '0.5.0'
    | '1.0.0'
    | '1.0.1'
    | '1.0.2'
    | '1.1.0'
    | '1.4.0'
    | '1.6.0'
    | '1.8.0'
    | '3.0.0'
    | '3.0.1'
    | '3.3.0'
    | '3.5.0'
    | '4.0.0'
    | '4.0.1';
  format: Array<'application/hl7-cda+xml'>;
  /* Name for this capability statement (computer friendly) */
  name?: string;
  /* Software that is covered by this capability statement */
  software?: {
    _releaseDate?: Element;
    _name?: Element;
    /* Date this version was released */
    releaseDate?: dateTime;
    /* Version covered by this statement */
    version?: string;
    /* A name the software is known by */
    name: string;
    _version?: Element;
  };
  /* Name for this capability statement (human friendly) */
  title?: string;
  _publisher?: Element;
  /* instance | capability | requirements */
  kind: 'capability' | 'instance' | 'requirements';
  jurisdiction?: CodeableConcept;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  contact?: ContactDetail;
  /* Business version of the capability statement */
  version?: string;
  /* Canonical identifier for this capability statement, represented as a URI (globally unique) */
  url?: uri;
  /* Date last changed */
  date: dateTime;
  _title?: Element;
  _experimental?: Element;
  rest?: {
    _documentation?: Element;
    /* client | server */
    mode: 'client' | 'server';
    interaction?: {
      _code?: Element;
      _documentation?: Element;
      /* transaction | batch | search-system | history-system */
      code: 'batch' | 'history-system' | 'search-system' | 'transaction';
      /* Anything special about operation behavior */
      documentation?: markdown;
    };
    operation?: any;
    _compartment?: Element;
    _mode?: Element;
    /* General description of implementation */
    documentation?: markdown;
    resource?: {
      _conditionalUpdate?: Element;
      /* If allows/uses conditional create */
      conditionalCreate?: boolean;
      _documentation?: Element;
      /* Additional information about the use of the resource type */
      documentation?: markdown;
      _conditionalDelete?: Element;
      /* not-supported | modified-since | not-match | full-support */
      conditionalRead?: 'full-support' | 'modified-since' | 'not-match' | 'not-supported';
      /* Whether vRead can return past versions */
      readHistory?: boolean;
      /* not-supported | single | multiple - how conditional delete is supported */
      conditionalDelete?: 'multiple' | 'not-supported' | 'single';
      _referencePolicy?: Element;
      interaction?: {
        _documentation?: Element;
        /* read | vread | update | patch | delete | history-instance | history-type | create | search-type */
        code:
          | 'create'
          | 'delete'
          | 'history-instance'
          | 'history-type'
          | 'patch'
          | 'read'
          | 'search-type'
          | 'update'
          | 'vread';
        /* Anything special about operation behavior */
        documentation?: markdown;
        _code?: Element;
      };
      /* Base System profile for all uses of resource */
      profile?: canonical;
      searchInclude?: string;
      /* If update can commit to a new identity */
      updateCreate?: boolean;
      _type?: Element;
      supportedProfile?: canonical;
      /* If allows/uses conditional update */
      conditionalUpdate?: boolean;
      searchRevInclude?: string;
      /* A resource type that is supported */
      'type':
        | 'Account'
        | 'ActivityDefinition'
        | 'AdverseEvent'
        | 'AllergyIntolerance'
        | 'Appointment'
        | 'AppointmentResponse'
        | 'AuditEvent'
        | 'Basic'
        | 'Binary'
        | 'BiologicallyDerivedProduct'
        | 'BodyStructure'
        | 'Bundle'
        | 'CapabilityStatement'
        | 'CarePlan'
        | 'CareTeam'
        | 'CatalogEntry'
        | 'ChargeItem'
        | 'ChargeItemDefinition'
        | 'Claim'
        | 'ClaimResponse'
        | 'ClinicalImpression'
        | 'CodeSystem'
        | 'Communication'
        | 'CommunicationRequest'
        | 'CompartmentDefinition'
        | 'Composition'
        | 'ConceptMap'
        | 'Condition'
        | 'Consent'
        | 'Contract'
        | 'Coverage'
        | 'CoverageEligibilityRequest'
        | 'CoverageEligibilityResponse'
        | 'DetectedIssue'
        | 'Device'
        | 'DeviceDefinition'
        | 'DeviceMetric'
        | 'DeviceRequest'
        | 'DeviceUseStatement'
        | 'DiagnosticReport'
        | 'DocumentManifest'
        | 'DocumentReference'
        | 'DomainResource'
        | 'EffectEvidenceSynthesis'
        | 'Encounter'
        | 'Endpoint'
        | 'EnrollmentRequest'
        | 'EnrollmentResponse'
        | 'EpisodeOfCare'
        | 'EventDefinition'
        | 'Evidence'
        | 'EvidenceVariable'
        | 'ExampleScenario'
        | 'ExplanationOfBenefit'
        | 'FamilyMemberHistory'
        | 'Flag'
        | 'Goal'
        | 'GraphDefinition'
        | 'Group'
        | 'GuidanceResponse'
        | 'HealthcareService'
        | 'ImagingStudy'
        | 'Immunization'
        | 'ImmunizationEvaluation'
        | 'ImmunizationRecommendation'
        | 'ImplementationGuide'
        | 'InsurancePlan'
        | 'Invoice'
        | 'Library'
        | 'Linkage'
        | 'List'
        | 'Location'
        | 'Measure'
        | 'MeasureReport'
        | 'Media'
        | 'Medication'
        | 'MedicationAdministration'
        | 'MedicationDispense'
        | 'MedicationKnowledge'
        | 'MedicationRequest'
        | 'MedicationStatement'
        | 'MedicinalProduct'
        | 'MedicinalProductAuthorization'
        | 'MedicinalProductContraindication'
        | 'MedicinalProductIndication'
        | 'MedicinalProductIngredient'
        | 'MedicinalProductInteraction'
        | 'MedicinalProductManufactured'
        | 'MedicinalProductPackaged'
        | 'MedicinalProductPharmaceutical'
        | 'MedicinalProductUndesirableEffect'
        | 'MessageDefinition'
        | 'MessageHeader'
        | 'MolecularSequence'
        | 'NamingSystem'
        | 'NutritionOrder'
        | 'Observation'
        | 'ObservationDefinition'
        | 'OperationDefinition'
        | 'OperationOutcome';
      _versioning?: Element;
      _readHistory?: Element;
      searchParam?: {
        _name?: Element;
        /* Source of definition for parameter */
        definition?: canonical;
        /* Server-specific usage */
        documentation?: markdown;
        /* Name of search parameter */
        name: string;
        _type?: Element;
        _documentation?: Element;
        /* number | date | string | token | reference | composite | quantity | uri | special */
        'type': 'composite' | 'date' | 'number' | 'quantity' | 'reference' | 'special' | 'string' | 'token' | 'uri';
        _definition?: Element;
      };
      _searchInclude?: Element;
      _updateCreate?: Element;
      _conditionalCreate?: Element;
      operation?: {
        _documentation?: Element;
        _name?: Element;
        /* The defined operation/query */
        definition: canonical;
        /* Specific details about operation behavior */
        documentation?: markdown;
        /* Name by which the operation/query is invoked */
        name: string;
        _definition?: Element;
      };
      _supportedProfile?: Element;
      _profile?: Element;
      referencePolicy?: Array<'enforced' | 'literal' | 'local' | 'logical' | 'resolves'>;
      _conditionalRead?: Element;
      _searchRevInclude?: Element;
      /* no-version | versioned | versioned-update */
      versioning?: 'no-version' | 'versioned' | 'versioned-update';
    };
    /* Information about security of implementation */
    security?: {
      service?: CodeableConcept;
      /* Adds CORS Headers (http://enable-cors.org/) */
      cors?: boolean;
      _description?: Element;
      /* General description of how security works */
      description?: markdown;
      _cors?: Element;
    };
    searchParam?: any;
    compartment?: canonical;
  };
  _instantiates?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _status?: Element;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  implementationGuide?: canonical;
  useContext?: UsageContext;
  _url?: Element;
  _patchFormat?: Element;
  instantiates?: canonical;
  /* If this describes a specific instance */
  implementation?: {
    _description?: Element;
    _url?: Element;
    /* Describes this specific instance */
    description: string;
    /* Organization that manages the data */
    custodian?: Reference<'Organization'>;
    /* Base URL for the installation */
    url?: url;
  };
  _imports?: Element;
  /* Natural language description of the capability statement */
  description?: markdown;
  _format?: Element;
  _date?: Element;
  _implementationGuide?: Element;
  _version?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  patchFormat?: Array<'application/hl7-cda+xml'>;
  messaging?: {
    supportedMessage?: {
      _mode?: Element;
      /* sender | receiver */
      mode: 'receiver' | 'sender';
      /* Message supported by this system */
      definition: canonical;
      _definition?: Element;
    };
    endpoint?: {
      /* http | ftp | mllp + */
      protocol: Coding;
      /* Network address or identifier of the end-point */
      address: url;
      _address?: Element;
    };
    /* Reliable Message Cache Length (min) */
    reliableCache?: unsignedInt;
    /* Messaging interface behavior details */
    documentation?: markdown;
    _documentation?: Element;
    _reliableCache?: Element;
  };
  _copyright?: Element;
  _purpose?: Element;
}

/* Logical Model: A pattern to be followed by resources that represent the performance of some activity, possibly in accordance with a request or service definition. */
export type Event = any;
/* A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */
export interface Device extends DomainResource, Resource<'Device'> {
  _serialNumber?: Element;
  _partNumber?: Element;
  _manufactureDate?: Element;
  /* Lot number of manufacture */
  lotNumber?: string;
  specialization?: {
    /* The version of the standard that is used to operate and communicate */
    version?: string;
    _version?: Element;
    /* The standard that is used to operate and communicate */
    systemType: CodeableConcept;
  };
  /* Organization responsible for device */
  owner?: Reference<'Organization'>;
  udiCarrier?: {
    /* barcode | rfid | manual + */
    entryType?: 'barcode' | 'card' | 'manual' | 'rfid' | 'self-reported' | 'unknown';
    _jurisdiction?: Element;
    _carrierAIDC?: Element;
    _issuer?: Element;
    _deviceIdentifier?: Element;
    /* UDI Human Readable Barcode String */
    carrierHRF?: string;
    /* UDI Issuing Organization */
    issuer?: uri;
    /* UDI Machine Readable Barcode String */
    carrierAIDC?: base64Binary;
    /* Mandatory fixed portion of UDI */
    deviceIdentifier?: string;
    _entryType?: Element;
    /* Regional UDI authority */
    jurisdiction?: uri;
    _carrierHRF?: Element;
  };
  /* Date when the device was made */
  manufactureDate?: dateTime;
  /* Serial number assigned by the manufacturer */
  serialNumber?: string;
  /* Where the device is found */
  location?: Reference<'Location'>;
  /* The reference to the definition for the device */
  definition?: Reference<'DeviceDefinition'>;
  /* The model number for the device */
  modelNumber?: string;
  /* Network address to contact device */
  url?: uri;
  statusReason?: CodeableConcept;
  /* Date and time of expiry of this device (if applicable) */
  expirationDate?: dateTime;
  _url?: Element;
  /* Name of device manufacturer */
  manufacturer?: string;
  /* The parent device */
  parent?: Reference<'Device'>;
  version?: {
    /* The type of the device version */
    'type'?: CodeableConcept;
    _value?: Element;
    /* The version text */
    value: string;
    /* A single component of the device version */
    component?: Identifier;
  };
  property?: {
    /* Code that specifies the property DeviceDefinitionPropetyCode (Extensible) */
    'type': CodeableConcept;
    valueQuantity?: Quantity;
    valueCode?: CodeableConcept;
  };
  note?: Annotation;
  _expirationDate?: Element;
  deviceName?: {
    _name?: Element;
    _type?: Element;
    /* The name of the device */
    name: string;
    /* udi-label-name | user-friendly-name | patient-reported-name | manufacturer-name | model-name | other */
    'type':
      | 'manufacturer-name'
      | 'model-name'
      | 'other'
      | 'patient-reported-name'
      | 'udi-label-name'
      | 'user-friendly-name';
  };
  /* The kind or type of device */
  'type'?: CodeableConcept;
  _lotNumber?: Element;
  contact?: ContactPoint;
  /* Patient to whom Device is affixed */
  patient?: Reference<'Patient'>;
  _distinctIdentifier?: Element;
  /* The distinct identification string */
  distinctIdentifier?: string;
  _manufacturer?: Element;
  identifier?: Identifier;
  _status?: Element;
  safety?: CodeableConcept;
  /* The part number of the device */
  partNumber?: string;
  /* active | inactive | entered-in-error | unknown */
  status?:
    | 'active'
    | 'entered-in-error'
    | 'inactive'
    | 'unknown'
    | 'hw-discon'
    | 'not-ready'
    | 'off'
    | 'offline'
    | 'online'
    | 'paused'
    | 'standby'
    | 'transduc-discon';
  _modelNumber?: Element;
}

/* The EventDefinition resource provides a reusable description of when a particular event can occur. */
export interface EventDefinition extends DomainResource, Resource<'EventDefinition'> {
  /* When the event definition was last reviewed */
  lastReviewDate?: date;
  reviewer?: ContactDetail;
  _usage?: Element;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _experimental?: Element;
  _version?: Element;
  topic?: CodeableConcept;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _purpose?: Element;
  author?: ContactDetail;
  contact?: ContactDetail;
  _approvalDate?: Element;
  _lastReviewDate?: Element;
  _date?: Element;
  _description?: Element;
  _title?: Element;
  /* Natural language description of the event definition */
  description?: markdown;
  editor?: ContactDetail;
  /* Type of individual the event definition is focused on */
  subject?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Group'>;
  };
  _publisher?: Element;
  relatedArtifact?: RelatedArtifact;
  /* Subordinate title of the event definition */
  subtitle?: string;
  /* When the event definition is expected to be used */
  effectivePeriod?: Period;
  /* Name for this event definition (computer friendly) */
  name?: string;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  identifier?: Identifier;
  /* Name for this event definition (human friendly) */
  title?: string;
  trigger: TriggerDefinition;
  /* When the event definition was approved by publisher */
  approvalDate?: date;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _url?: Element;
  jurisdiction?: CodeableConcept;
  useContext?: UsageContext;
  /* Describes the clinical usage of the event definition */
  usage?: string;
  /* Business version of the event definition */
  version?: string;
  _name?: Element;
  /* Date last changed */
  date?: dateTime;
  /* Canonical identifier for this event definition, represented as a URI (globally unique) */
  url?: uri;
  endorser?: ContactDetail;
  /* Why this event definition is defined */
  purpose?: markdown;
  _subtitle?: Element;
  _copyright?: Element;
  _status?: Element;
}

/* Base StructureDefinition for MarketingStatus Type: The marketing status describes the date when a medicinal product is actually put on the market or the date as of which it is no longer available. */
export interface MarketingStatus extends BackboneElement {
  /* Where a Medicines Regulatory Agency has granted a marketing authorisation for which specific provisions within a jurisdiction apply, the jurisdiction can be specified using an appropriate controlled terminology The controlled term and the controlled term identifier shall be specified */
  jurisdiction?: CodeableConcept;
  /* This attribute provides information on the status of the marketing of the medicinal product See ISO/TS 20443 for more information and examples */
  status: CodeableConcept;
  /* The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain */
  restoreDate?: dateTime;
  _restoreDate?: Element;
  /* The country in which the marketing authorisation has been granted shall be specified It should be specified using the ISO 3166 ‑ 1 alpha-2 code elements */
  country: CodeableConcept;
  /* The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain */
  dateRange: Period;
}

export interface HolidaysCalendar extends Resource<'HolidaysCalendar'> {
  holidays?: {
    startDate: dateTime;
    endDate: dateTime;
    name: string;
  };
  system?: boolean;
  name: string;
  systemAccount: Reference<'SystemAccount'>;
}

export type RPCsearchLocations = {
  method: 'relatient.pmsystem/search-locations';
  params: {
    account: string;
    'pm-id': string;
    search?: string;
  };
};
export type RPCsearchPractitioners = {
  method: 'relatient.pmsystem/search-practitioners';
  params: {
    account: string;
    'pm-id': string;
    search?: string;
  };
};
/* Base StructureDefinition for TriggerDefinition Type: A description of a triggering event. Triggering events can be named events, data events, or periodic, as determined by the type element. */
export interface TriggerDefinition extends Element {
  _type?: Element;
  /* Name or URI that identifies the event */
  name?: string;
  _name?: Element;
  data?: DataRequirement;
  /* Whether the event triggers (boolean expression) */
  condition?: Expression;
  /* Timing of the event */
  timing?: {
    Reference?: Reference<'Schedule'>;
    Timing?: Timing;
    _date?: Element;
    _dateTime?: Element;
    date?: date;
    dateTime?: dateTime;
  };
  /* named-event | periodic | data-changed | data-added | data-modified | data-removed | data-accessed | data-access-ended */
  'type':
    | 'data-accessed'
    | 'data-access-ended'
    | 'data-added'
    | 'data-changed'
    | 'data-modified'
    | 'data-removed'
    | 'named-event'
    | 'periodic';
}

/* The regulatory authorization of a medicinal product. */
export interface MedicinalProductAuthorization extends DomainResource, Resource<'MedicinalProductAuthorization'> {
  _internationalBirthDate?: Element;
  /* The regulatory procedure for granting or amending a marketing authorization */
  procedure?: {
    /* Identifier for this procedure */
    identifier?: Identifier;
    /* Date of procedure */
    date?: {
      _dateTime?: Element;
      Period?: Period;
      dateTime?: dateTime;
    };
    /* Type of procedure */
    'type': CodeableConcept;
    application?: any;
  };
  /* The status of the marketing authorization */
  status?: CodeableConcept;
  /* The medicinal product that is being authorized */
  subject?: Reference<'MedicinalProductPackaged' | 'MedicinalProduct'>;
  /* Marketing Authorization Holder */
  holder?: Reference<'Organization'>;
  identifier?: Identifier;
  jurisdictionalAuthorization?: {
    /* The start and expected end date of the authorization */
    validityPeriod?: Period;
    /* The legal status of supply in a jurisdiction or region */
    legalStatusOfSupply?: CodeableConcept;
    /* Country of authorization */
    country?: CodeableConcept;
    identifier?: Identifier;
    jurisdiction?: CodeableConcept;
  };
  _restoreDate?: Element;
  country?: CodeableConcept;
  /* The beginning of the time period in which the marketing authorization is in the specific status shall be specified A complete date consisting of day, month and year shall be specified using the ISO 8601 date format */
  validityPeriod?: Period;
  /* A period of time after authorization before generic product applicatiosn can be submitted */
  dataExclusivityPeriod?: Period;
  /* The legal framework against which this authorization is granted */
  legalBasis?: CodeableConcept;
  _statusDate?: Element;
  /* The date at which the given status has become applicable */
  statusDate?: dateTime;
  /* Medicines Regulatory Agency */
  regulator?: Reference<'Organization'>;
  /* Date of first marketing authorization for a company's new medicinal product in any country in the World */
  internationalBirthDate?: dateTime;
  _dateOfFirstAuthorization?: Element;
  jurisdiction?: CodeableConcept;
  /* The date when a suspended the marketing or the marketing authorization of the product is anticipated to be restored */
  restoreDate?: dateTime;
  /* The date when the first authorization was granted by a Medicines Regulatory Agency */
  dateOfFirstAuthorization?: dateTime;
}

export interface Schedule extends DomainResource, Resource<'Schedule'> {
  /* Whether this schedule is in active use */
  active?: boolean;
  identifier?: Identifier;
  specialty?: Array<CodeableConcept>;
  _comment?: Element;
  /* Period of time covered by schedule */
  planningHorizon?: Period;
  _active?: Element;
  serviceCategory?: CodeableConcept;
  /* Comments on availability */
  comment?: string;
  actor: Array<
    Reference<
      'Device' | 'HealthcareService' | 'RelatedPerson' | 'Practitioner' | 'PractitionerRole' | 'Location' | 'Patient'
    >
  >;
  serviceType?: CodeableConcept;
}

export type RPCgetCodesystems = {
  method: 'relatient.terminology/get-codesystems';
  params: {
    [key: string]: any;
  };
};
/* An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient. */
export interface Encounter extends DomainResource, Resource<'Encounter'> {
  /* Details about the admission to a healthcare service */
  hospitalization?: {
    specialArrangement?: Array<CodeableConcept>;
    dietPreference?: CodeableConcept;
    /* From where patient was admitted (physician referral, transfer) */
    admitSource?: 'born' | 'emd' | 'gp' | 'hosp-trans' | 'mp' | 'nursing' | 'other' | 'outp' | 'psych' | 'rehab';
    /* Location/organization to which the patient is discharged */
    destination?: Reference<'Location' | 'Organization'>;
    /* The location/organization from which the patient came before admission */
    origin?: Reference<'Organization' | 'Location'>;
    specialCourtesy?: Array<CodeableConcept>;
    /* The type of hospital re-admission that has occurred (if any). If the value is absent, then this is not identified as a readmission */
    reAdmission?: CodeableConcept;
    /* Category or kind of location after discharge */
    dischargeDisposition?: CodeableConcept;
    /* Pre-admission identifier */
    preAdmissionIdentifier?: Identifier;
  };
  _status?: Element;
  classHistory?: {
    /* The time that the episode was in the specified class */
    period: Period;
    /* inpatient | outpatient | ambulatory | emergency + */
    class: Coding;
  };
  identifier?: Identifier;
  /* Quantity of time the encounter lasted (less time absent) */
  length?: Duration;
  location?: {
    /* The physical type of the location (usually the level in the location hierachy - bed room ward etc.) */
    physicalType?: CodeableConcept;
    /* planned | active | reserved | completed */
    status?: 'active' | 'completed' | 'planned' | 'reserved';
    /* Location the encounter takes place */
    location: Reference<'Location'>;
    /* Time period during which the patient was present at the location */
    period?: Period;
    _status?: Element;
  };
  appointment?: Array<Reference<'Appointment'>>;
  /* The organization (facility) responsible for this encounter */
  serviceProvider?: Reference<'Organization'>;
  /* Another Encounter this encounter is part of */
  partOf?: Reference<'Encounter'>;
  account?: Array<Reference<'Account'>>;
  /* The patient or group present at the encounter */
  subject?: Reference<'Group' | 'Patient'>;
  diagnosis?: {
    _rank?: Element;
    /* The diagnosis or procedure relevant to the encounter */
    condition: Reference<'Procedure' | 'Condition'>;
    /* Ranking of the diagnosis (for each role type) */
    rank?: positiveInt;
    /* Role that this diagnosis has within the encounter (e.g. admission, billing, discharge …) */
    use?: 'AD' | 'billing' | 'CC' | 'CM' | 'DD' | 'post-op' | 'pre-op';
  };
  reasonCode?: Array<CodeableConcept>;
  basedOn?: Array<Reference<'ServiceRequest'>>;
  participant?: {
    /* Persons involved in the encounter other than the patient */
    individual?: Reference<'Practitioner' | 'RelatedPerson' | 'PractitionerRole'>;
    'type'?: CodeableConcept;
    /* Period of time during the encounter that the participant participated */
    period?: Period;
  };
  /* Classification of patient encounter */
  class: Coding;
  episodeOfCare?: Array<Reference<'EpisodeOfCare'>>;
  statusHistory?: {
    /* The time that the episode was in the specified status */
    period: Period;
    _status?: Element;
    /* planned | arrived | triaged | in-progress | onleave | finished | cancelled + */
    status:
      | 'arrived'
      | 'cancelled'
      | 'entered-in-error'
      | 'finished'
      | 'in-progress'
      | 'onleave'
      | 'planned'
      | 'triaged'
      | 'unknown';
  };
  'type'?: CodeableConcept;
  /* Indicates the urgency of the encounter */
  priority?: CodeableConcept;
  reasonReference?: Array<Reference<'ImmunizationRecommendation' | 'Procedure' | 'Condition' | 'Observation'>>;
  /* The start and end time of the encounter */
  period?: Period;
  /* Specific type of service */
  serviceType?: CodeableConcept;
  /* planned | arrived | triaged | in-progress | onleave | finished | cancelled + */
  status:
    | 'arrived'
    | 'cancelled'
    | 'entered-in-error'
    | 'finished'
    | 'in-progress'
    | 'onleave'
    | 'planned'
    | 'triaged'
    | 'unknown';
}

/* This resource provides: the claim details; adjudication details from the processing of a Claim; and optionally account balance information, for informing the subscriber of the benefits provided. */
export interface ExplanationOfBenefit extends DomainResource, Resource<'ExplanationOfBenefit'> {
  /* For whom to reserve funds */
  fundsReserveRequested?: CodeableConcept;
  /* Response creation date */
  created: dateTime;
  /* Printed reference or actual form */
  form?: Attachment;
  careTeam?: {
    _responsible?: Element;
    /* Function within the team */
    role?: CodeableConcept;
    /* Indicator of the lead practitioner */
    responsible?: boolean;
    /* Order of care team */
    sequence: positiveInt;
    /* Practitioner or organization */
    provider: Reference<'PractitionerRole' | 'Practitioner' | 'Organization'>;
    /* Practitioner credential or specialization */
    qualification?: CodeableConcept;
    _sequence?: Element;
  };
  identifier?: Identifier;
  addItem?: {
    provider?: Array<Reference<'Organization' | 'PractitionerRole' | 'Practitioner'>>;
    /* Anatomical location */
    bodySite?: CodeableConcept;
    detail?: {
      modifier?: CodeableConcept;
      /* Billing, service, product, or drug code */
      productOrService: CodeableConcept;
      /* Count of products or services */
      quantity?: Quantity;
      noteNumber?: positiveInt;
      /* Fee, charge or cost per item */
      unitPrice?: Money;
      adjudication?: any;
      subDetail?: {
        /* Count of products or services */
        quantity?: Quantity;
        noteNumber?: positiveInt;
        _factor?: Element;
        adjudication?: any;
        modifier?: CodeableConcept;
        /* Total item cost */
        net?: Money;
        /* Fee, charge or cost per item */
        unitPrice?: Money;
        /* Billing, service, product, or drug code */
        productOrService: CodeableConcept;
        _noteNumber?: Element;
        /* Price scaling factor */
        factor?: decimal;
      };
      /* Price scaling factor */
      factor?: decimal;
      /* Total item cost */
      net?: Money;
      _noteNumber?: Element;
      _factor?: Element;
    };
    _detailSequence?: Element;
    /* Count of products or services */
    quantity?: Quantity;
    /* Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    _factor?: Element;
    subSite?: CodeableConcept;
    /* Fee, charge or cost per item */
    unitPrice?: Money;
    _itemSequence?: Element;
    /* Place of service or where product was supplied */
    location?: {
      Reference?: Reference<'Location'>;
      Address?: Address;
      CodeableConcept?: CodeableConcept;
    };
    /* Date or dates of service or product delivery */
    serviced?: {
      Period?: Period;
      date?: date;
      _date?: Element;
    };
    subDetailSequence?: positiveInt;
    /* Total item cost */
    net?: Money;
    itemSequence?: positiveInt;
    /* Price scaling factor */
    factor?: decimal;
    _subDetailSequence?: Element;
    adjudication?: any;
    detailSequence?: positiveInt;
    _noteNumber?: Element;
    modifier?: CodeableConcept;
    noteNumber?: positiveInt;
    programCode?: CodeableConcept;
  };
  /* Original prescription if superceded by fulfiller */
  originalPrescription?: Reference<'MedicationRequest'>;
  preAuthRef?: string;
  _outcome?: Element;
  _precedence?: Element;
  _status?: Element;
  preAuthRefPeriod?: Period;
  processNote?: {
    _text?: Element;
    /* display | print | printoper */
    'type'?: 'display' | 'print' | 'printoper';
    /* Note explanatory text */
    text?: string;
    /* Language of the text */
    language?:
      | 'ar'
      | 'bn'
      | 'cs'
      | 'da'
      | 'de'
      | 'de-AT'
      | 'de-CH'
      | 'de-DE'
      | 'el'
      | 'en'
      | 'en-AU'
      | 'en-CA'
      | 'en-GB'
      | 'en-IN'
      | 'en-NZ'
      | 'en-SG'
      | 'en-US'
      | 'es'
      | 'es-AR'
      | 'es-ES'
      | 'es-UY'
      | 'fi'
      | 'fr'
      | 'fr-BE'
      | 'fr-CH'
      | 'fr-FR'
      | 'fy'
      | 'fy-NL'
      | 'hi'
      | 'hr'
      | 'it'
      | 'it-CH'
      | 'it-IT'
      | 'ja'
      | 'ko'
      | 'nl'
      | 'nl-BE'
      | 'nl-NL'
      | 'no'
      | 'no-NO'
      | 'pa'
      | 'pl'
      | 'pt'
      | 'pt-BR'
      | 'ru'
      | 'ru-RU'
      | 'sr'
      | 'sr-RS'
      | 'sv'
      | 'sv-SE'
      | 'te'
      | 'zh'
      | 'zh-CN'
      | 'zh-HK'
      | 'zh-SG'
      | 'zh-TW';
    _number?: Element;
    /* Note instance identifier */
    number?: positiveInt;
    _type?: Element;
  };
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  total?: {
    /* Financial total for the category */
    amount: Money;
    /* Type of adjudication information */
    category: CodeableConcept;
  };
  /* Recipient of benefits payable */
  payee?: {
    /* Recipient reference */
    party?: Reference<'Patient' | 'Practitioner' | 'RelatedPerson' | 'Organization' | 'PractitionerRole'>;
    /* Category of recipient */
    'type'?: CodeableConcept;
  };
  insurance: {
    _preAuthRef?: Element;
    /* Coverage to be used for adjudication */
    focal: boolean;
    _focal?: Element;
    /* Insurance information */
    coverage: Reference<'Coverage'>;
    preAuthRef?: string;
  };
  /* Prescription authorizing services or products */
  prescription?: Reference<'VisionPrescription' | 'MedicationRequest'>;
  procedure?: {
    /* When the procedure was performed */
    date?: dateTime;
    _date?: Element;
    /* Specific clinical procedure */
    procedure?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Procedure'>;
    };
    'type'?: CodeableConcept;
    udi?: Array<Reference<'Device'>>;
    /* Procedure instance identifier */
    sequence: positiveInt;
    _sequence?: Element;
  };
  /* Treatment Referral */
  referral?: Reference<'ServiceRequest'>;
  /* Servicing Facility */
  facility?: Reference<'Location'>;
  benefitBalance?: {
    _excluded?: Element;
    _description?: Element;
    /* Benefit classification */
    category: CodeableConcept;
    financial?: {
      /* Benefits allowed */
      allowed?: {
        _unsignedInt?: Element;
        Money?: Money;
        _string?: Element;
        string?: string;
        unsignedInt?: unsignedInt;
      };
      /* Benefits used */
      used?: {
        unsignedInt?: unsignedInt;
        _unsignedInt?: Element;
        Money?: Money;
      };
      /* Benefit classification */
      'type': CodeableConcept;
    };
    /* Short name for the benefit */
    name?: string;
    /* In or out of network */
    network?: CodeableConcept;
    _name?: Element;
    /* Excluded from the plan */
    excluded?: boolean;
    /* Annual or lifetime */
    term?: CodeableConcept;
    /* Description of the benefit or services covered */
    description?: string;
    /* Individual or family */
    unit?: CodeableConcept;
  };
  related?: {
    /* Reference to the related claim */
    claim?: Reference<'Claim'>;
    /* How the reference claim is related */
    relationship?: CodeableConcept;
    /* File or case reference */
    reference?: Identifier;
  };
  /* Relevant time frame for the claim */
  billablePeriod?: Period;
  item?: {
    diagnosisSequence?: positiveInt;
    procedureSequence?: positiveInt;
    encounter?: Array<Reference<'Encounter'>>;
    adjudication?: {
      /* Non-monitary value */
      value?: decimal;
      /* Monetary amount */
      amount?: Money;
      /* Explanation of adjudication outcome */
      reason?: CodeableConcept;
      _value?: Element;
      /* Type of adjudication information */
      category: CodeableConcept;
    };
    informationSequence?: positiveInt;
    noteNumber?: positiveInt;
    detail?: {
      /* Benefit classification */
      category?: CodeableConcept;
      programCode?: CodeableConcept;
      adjudication?: any;
      modifier?: CodeableConcept;
      /* Revenue or cost center code */
      revenue?: CodeableConcept;
      /* Fee, charge or cost per item */
      unitPrice?: Money;
      subDetail?: {
        _sequence?: Element;
        /* Product or service provided */
        sequence: positiveInt;
        /* Benefit classification */
        category?: CodeableConcept;
        /* Revenue or cost center code */
        revenue?: CodeableConcept;
        adjudication?: any;
        modifier?: CodeableConcept;
        /* Total item cost */
        net?: Money;
        udi?: Array<Reference<'Device'>>;
        _factor?: Element;
        /* Count of products or services */
        quantity?: Quantity;
        _noteNumber?: Element;
        /* Price scaling factor */
        factor?: decimal;
        noteNumber?: positiveInt;
        /* Billing, service, product, or drug code */
        productOrService: CodeableConcept;
        programCode?: CodeableConcept;
        /* Fee, charge or cost per item */
        unitPrice?: Money;
      };
      _factor?: Element;
      /* Total item cost */
      net?: Money;
      /* Product or service provided */
      sequence: positiveInt;
      udi?: Array<Reference<'Device'>>;
      _noteNumber?: Element;
      /* Billing, service, product, or drug code */
      productOrService: CodeableConcept;
      /* Count of products or services */
      quantity?: Quantity;
      _sequence?: Element;
      noteNumber?: positiveInt;
      /* Price scaling factor */
      factor?: decimal;
    };
    /* Count of products or services */
    quantity?: Quantity;
    /* Fee, charge or cost per item */
    unitPrice?: Money;
    /* Item instance identifier */
    sequence: positiveInt;
    /* Revenue or cost center code */
    revenue?: CodeableConcept;
    _factor?: Element;
    programCode?: CodeableConcept;
    careTeamSequence?: positiveInt;
    _diagnosisSequence?: Element;
    /* Price scaling factor */
    factor?: decimal;
    modifier?: CodeableConcept;
    _careTeamSequence?: Element;
    /* Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    /* Benefit classification */
    category?: CodeableConcept;
    udi?: Array<Reference<'Device'>>;
    _sequence?: Element;
    _noteNumber?: Element;
    _informationSequence?: Element;
    /* Total item cost */
    net?: Money;
    _procedureSequence?: Element;
    subSite?: CodeableConcept;
    /* Place of service or where product was supplied */
    location?: {
      Address?: Address;
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Location'>;
    };
    /* Date or dates of service or product delivery */
    serviced?: {
      Period?: Period;
      date?: date;
      _date?: Element;
    };
    /* Anatomical location */
    bodySite?: CodeableConcept;
  };
  /* The recipient of the products and services */
  patient: Reference<'Patient'>;
  adjudication?: any;
  /* Desired processing urgency */
  priority?: CodeableConcept;
  /* When the benefits are applicable */
  benefitPeriod?: Period;
  /* Printed form identifier */
  formCode?: CodeableConcept;
  _created?: Element;
  /* Author of the claim */
  enterer?: Reference<'Practitioner' | 'PractitionerRole'>;
  /* Party responsible for reimbursement */
  insurer: Reference<'Organization'>;
  /* Disposition Message */
  disposition?: string;
  /* Claim response reference */
  claimResponse?: Reference<'ClaimResponse'>;
  /* Payment Details */
  payment?: {
    /* Expected date of payment */
    date?: date;
    /* Partial or complete payment */
    'type'?: CodeableConcept;
    /* Payable amount after adjustment */
    amount?: Money;
    /* Business identifier for the payment */
    identifier?: Identifier;
    /* Payment adjustment for non-claim issues */
    adjustment?: Money;
    _date?: Element;
    /* Explanation for the variance */
    adjustmentReason?: CodeableConcept;
  };
  supportingInfo?: {
    /* Information instance identifier */
    sequence: positiveInt;
    /* Classification of the supplied information */
    category: CodeableConcept;
    /* When it occurred */
    timing?: {
      date?: date;
      Period?: Period;
      _date?: Element;
    };
    _sequence?: Element;
    /* Explanation for the information */
    reason?: Coding;
    /* Data to be provided */
    value?: {
      string?: string;
      Quantity?: Quantity;
      _boolean?: Element;
      Attachment?: Attachment;
      Reference?: Reference<'Reference'>;
      _string?: Element;
      boolean?: boolean;
    };
    /* Type of information */
    code?: CodeableConcept;
  };
  /* claim | preauthorization | predetermination */
  use: 'claim' | 'preauthorization' | 'predetermination';
  /* Category or discipline */
  'type': CodeableConcept;
  _disposition?: Element;
  _preAuthRef?: Element;
  diagnosis?: {
    _sequence?: Element;
    /* Package billing code */
    packageCode?: CodeableConcept;
    /* Diagnosis instance identifier */
    sequence: positiveInt;
    /* Present on admission */
    onAdmission?: CodeableConcept;
    /* Nature of illness or problem */
    diagnosis?: {
      Reference?: Reference<'Condition'>;
      CodeableConcept?: CodeableConcept;
    };
    'type'?: CodeableConcept;
  };
  /* queued | complete | error | partial */
  outcome: 'complete' | 'error' | 'partial' | 'queued';
  /* More granular claim type */
  subType?: CodeableConcept;
  /* Claim reference */
  claim?: Reference<'Claim'>;
  /* Party responsible for the claim */
  provider: Reference<'Organization' | 'Practitioner' | 'PractitionerRole'>;
  _use?: Element;
  /* Precedence (primary, secondary, etc.) */
  precedence?: positiveInt;
  /* Funds reserved status */
  fundsReserve?: CodeableConcept;
  /* Details of the event */
  accident?: {
    _date?: Element;
    /* Where the event occurred */
    location?: {
      Reference?: Reference<'Location'>;
      Address?: Address;
    };
    /* The nature of the accident */
    'type'?: CodeableConcept;
    /* When the incident occurred */
    date?: date;
  };
}

/* A kind of specimen with associated set of requirements. */
export interface SpecimenDefinition extends DomainResource, Resource<'SpecimenDefinition'> {
  _timeAspect?: Element;
  /* Time aspect for collection */
  timeAspect?: string;
  typeTested?: {
    /* Type of intended specimen */
    'type'?: CodeableConcept;
    _requirement?: Element;
    rejectionCriterion?: CodeableConcept;
    /* Specimen requirements */
    requirement?: string;
    /* Specimen retention time */
    retentionTime?: Duration;
    /* preferred | alternate */
    preference: 'alternate' | 'preferred';
    _isDerived?: Element;
    /* The specimen's container */
    container?: {
      /* Specimen container preparation */
      preparation?: string;
      /* Kind of container associated with the kind of specimen */
      'type'?: CodeableConcept;
      /* Container material */
      material?: CodeableConcept;
      _description?: Element;
      /* Color of container cap */
      cap?: CodeableConcept;
      /* Container capacity */
      capacity?: Quantity;
      additive?: {
        /* Additive associated with container */
        additive?: {
          Reference?: Reference<'Substance'>;
          CodeableConcept?: CodeableConcept;
        };
      };
      _preparation?: Element;
      /* Minimum volume */
      minimumVolume?: {
        string?: string;
        Quantity?: Quantity;
        _string?: Element;
      };
      /* Container description */
      description?: string;
    };
    handling?: {
      /* Temperature range */
      temperatureRange?: Range;
      /* Temperature qualifier */
      temperatureQualifier?: CodeableConcept;
      _instruction?: Element;
      /* Maximum preservation time */
      maxDuration?: Duration;
      /* Preservation instruction */
      instruction?: string;
    };
    /* Primary or secondary specimen */
    isDerived?: boolean;
    _preference?: Element;
  };
  /* Business identifier of a kind of specimen */
  identifier?: Identifier;
  collection?: CodeableConcept;
  patientPreparation?: CodeableConcept;
  /* Kind of material to collect */
  typeCollected?: CodeableConcept;
}

/* The manufactured item as contained in the packaged medicinal product. */
export interface MedicinalProductManufactured extends DomainResource, Resource<'MedicinalProductManufactured'> {
  ingredient?: Array<Reference<'MedicinalProductIngredient'>>;
  /* Dose form as manufactured and before any transformation into the pharmaceutical product */
  manufacturedDoseForm: CodeableConcept;
  /* The quantity or "count number" of the manufactured item */
  quantity: Quantity;
  /* Dimensions, color etc. */
  physicalCharacteristics?: ProdCharacteristic;
  manufacturer?: Array<Reference<'Organization'>>;
  /* The “real world” units in which the quantity of the manufactured item is described */
  unitOfPresentation?: CodeableConcept;
  otherCharacteristics?: CodeableConcept;
}

/* A summary of information based on the results of executing a TestScript. */
export interface TestReport extends DomainResource, Resource<'TestReport'> {
  /* When the TestScript was executed and this TestReport was generated */
  issued?: dateTime;
  /* Reference to the  version-specific TestScript that was executed to produce this TestReport */
  testScript: Reference<'TestScript'>;
  _issued?: Element;
  /* Informal name of the executed TestScript */
  name?: string;
  _name?: Element;
  _result?: Element;
  /* The results of running the series of required clean up steps */
  teardown?: {
    action: {
      /* The teardown operation performed */
      operation: any;
    };
  };
  /* Name of the tester producing this report (Organization or individual) */
  tester?: string;
  _tester?: Element;
  /* The results of the series of required setup operations before the tests were executed */
  setup?: {
    action: {
      /* The operation to perform */
      operation?: {
        _message?: Element;
        _result?: Element;
        /* A message associated with the result */
        message?: markdown;
        /* A link to further details on the result */
        detail?: uri;
        _detail?: Element;
        /* pass | skip | fail | warning | error */
        result: 'error' | 'fail' | 'pass' | 'skip' | 'warning';
      };
      /* The assertion to perform */
      assert?: {
        /* pass | skip | fail | warning | error */
        result: 'error' | 'fail' | 'pass' | 'skip' | 'warning';
        /* A link to further details on the result */
        detail?: string;
        /* A message associated with the result */
        message?: markdown;
        _message?: Element;
        _detail?: Element;
        _result?: Element;
      };
    };
  };
  /* completed | in-progress | waiting | stopped | entered-in-error */
  status: 'completed' | 'entered-in-error' | 'in-progress' | 'stopped' | 'waiting';
  participant?: {
    /* The uri of the participant. An absolute URL is preferred */
    uri: uri;
    _type?: Element;
    _uri?: Element;
    _display?: Element;
    /* The display name of the participant */
    display?: string;
    /* test-engine | client | server */
    'type': 'client' | 'server' | 'test-engine';
  };
  /* pass | fail | pending */
  result: 'fail' | 'pass' | 'pending';
  /* The final score (percentage of tests passed) resulting from the execution of the TestScript */
  score?: decimal;
  test?: {
    action: {
      /* The assertion performed */
      assert?: any;
      /* The operation performed */
      operation?: any;
    };
    _description?: Element;
    _name?: Element;
    /* Tracking/reporting short description of the test */
    description?: string;
    /* Tracking/logging name of this test */
    name?: string;
  };
  /* External identifier */
  identifier?: Identifier;
  _status?: Element;
  _score?: Element;
}

export type RPCgetTriageQuestions = {
  method: 'radix.analytics/get-triage-questions';
  params: {
    [key: string]: any;
  };
};
/* Measurements and simple assertions made about a patient, device or other subject. */
export interface Observation extends DomainResource, Resource<'Observation'> {
  /* Why the result is missing */
  dataAbsentReason?: CodeableConcept;
  /* How it was done */
  method?: CodeableConcept;
  /* Date/Time this version was made available */
  issued?: instant;
  /* Actual result */
  value?: {
    Quantity?: Quantity;
    _integer?: Element;
    Period?: Period;
    integer?: integer;
    _string?: Element;
    dateTime?: dateTime;
    SampledData?: SampledData;
    _boolean?: Element;
    Range?: Range;
    string?: string;
    Ratio?: Ratio;
    boolean?: boolean;
    _dateTime?: Element;
    _time?: Element;
    time?: time;
    CodeableConcept?: CodeableConcept;
  };
  /* Healthcare event during which this observation is made */
  encounter?: Reference<'Encounter'>;
  interpretation?: CodeableConcept;
  /* Specimen used for this observation */
  specimen?: Reference<'Specimen'>;
  _issued?: Element;
  _status?: Element;
  hasMember?: Array<Reference<'MolecularSequence' | 'QuestionnaireResponse' | 'Observation'>>;
  /* Clinically relevant time/time-period for observation */
  effective?: {
    Timing?: Timing;
    _dateTime?: Element;
    _instant?: Element;
    Period?: Period;
    dateTime?: dateTime;
    instant?: instant;
  };
  component?: {
    interpretation?: CodeableConcept;
    /* Type of component observation (code / type) */
    code: CodeableConcept;
    /* Why the component result is missing */
    dataAbsentReason?: CodeableConcept;
    referenceRange?: any;
    /* Actual component result */
    value?: {
      Range?: Range;
      Ratio?: Ratio;
      integer?: integer;
      dateTime?: dateTime;
      time?: time;
      _integer?: Element;
      Quantity?: Quantity;
      boolean?: boolean;
      _boolean?: Element;
      _string?: Element;
      CodeableConcept?: CodeableConcept;
      SampledData?: SampledData;
      Period?: Period;
      string?: string;
      _dateTime?: Element;
      _time?: Element;
    };
  };
  basedOn?: Array<
    Reference<
      | 'DeviceRequest'
      | 'CarePlan'
      | 'MedicationRequest'
      | 'ServiceRequest'
      | 'NutritionOrder'
      | 'ImmunizationRecommendation'
    >
  >;
  category?: Array<CodeableConcept>;
  derivedFrom?: Array<
    Reference<
      'QuestionnaireResponse' | 'MolecularSequence' | 'Observation' | 'DocumentReference' | 'Media' | 'ImagingStudy'
    >
  >;
  /* Observed body part */
  bodySite?: CodeableConcept;
  /* Type of observation (code / type) */
  code: CodeableConcept;
  focus?: Array<Reference<'Reference'>>;
  identifier?: Identifier;
  note?: Annotation;
  partOf?: Array<
    Reference<
      | 'Procedure'
      | 'ImagingStudy'
      | 'MedicationDispense'
      | 'Immunization'
      | 'MedicationStatement'
      | 'MedicationAdministration'
    >
  >;
  /* (Measurement) Device */
  device?: Reference<'Device' | 'DeviceMetric'>;
  performer?: Array<
    Reference<'CareTeam' | 'RelatedPerson' | 'Organization' | 'Practitioner' | 'Patient' | 'PractitionerRole'>
  >;
  referenceRange?: {
    _text?: Element;
    /* Applicable age range, if relevant */
    age?: Range;
    appliesTo?: CodeableConcept;
    /* High Range, if relevant */
    high?: Quantity;
    /* Low Range, if relevant */
    low?: Quantity;
    /* Text based reference range in an observation */
    text?: string;
    /* Reference range qualifier */
    'type'?:
      | 'endocrine'
      | 'follicular'
      | 'luteal'
      | 'midcycle'
      | 'normal'
      | 'post'
      | 'postmenopausal'
      | 'pre'
      | 'pre-puberty'
      | 'recommended'
      | 'therapeutic'
      | 'treatment'
      | 'type';
  };
  /* registered | preliminary | final | amended + */
  status:
    | 'amended'
    | 'cancelled'
    | 'corrected'
    | 'entered-in-error'
    | 'final'
    | 'preliminary'
    | 'registered'
    | 'unknown';
  /* Who and/or what the observation is about */
  subject?: Reference<'Location' | 'Device' | 'Group' | 'Patient'>;
}

/* A clinical condition, problem, diagnosis, or other event, situation, issue, or clinical concept that has risen to a level of concern. */
export interface Condition extends DomainResource, Resource<'Condition'> {
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* Who has the condition? */
  subject: Reference<'Patient' | 'Group'>;
  evidence?: {
    code?: CodeableConcept;
    detail?: Array<Reference<'Reference'>>;
  };
  identifier?: Identifier;
  stage?: {
    assessment?: Array<Reference<'DiagnosticReport' | 'Observation' | 'ClinicalImpression'>>;
    /* Kind of staging */
    'type'?: CodeableConcept;
    /* Simple summary (disease specific) */
    summary?: CodeableConcept;
  };
  /* active | recurrence | relapse | inactive | remission | resolved */
  clinicalStatus?: 'active' | 'inactive' | 'recurrence' | 'relapse' | 'remission' | 'resolved';
  category?: CodeableConcept;
  /* Who recorded the condition */
  recorder?: Reference<'Patient' | 'PractitionerRole' | 'RelatedPerson' | 'Practitioner'>;
  /* Subjective severity of condition */
  severity?: '24484000' | '255604002' | '6736007';
  /* Estimated or actual date,  date-time, or age */
  onset?: {
    string?: string;
    Range?: Range;
    Period?: Period;
    _dateTime?: Element;
    _string?: Element;
    dateTime?: dateTime;
    Age?: Age;
  };
  /* unconfirmed | provisional | differential | confirmed | refuted | entered-in-error */
  verificationStatus?: 'confirmed' | 'differential' | 'entered-in-error' | 'provisional' | 'refuted' | 'unconfirmed';
  /* When in resolution/remission */
  abatement?: {
    Age?: Age;
    Range?: Range;
    _dateTime?: Element;
    dateTime?: dateTime;
    Period?: Period;
    string?: string;
    _string?: Element;
  };
  /* Identification of the condition, problem or diagnosis */
  code?: CodeableConcept;
  /* Date record was first recorded */
  recordedDate?: dateTime;
  /* Person who asserts this condition */
  asserter?: Reference<'Practitioner' | 'PractitionerRole' | 'Patient' | 'RelatedPerson'>;
  _recordedDate?: Element;
  note?: Annotation;
  bodySite?: CodeableConcept;
}

/* The Library resource is a general-purpose container for knowledge asset definitions. It can be used to describe and expose existing knowledge assets such as logic libraries and information model descriptions, as well as to describe a collection of knowledge assets. */
export interface Library extends DomainResource, Resource<'Library'> {
  _date?: Element;
  _status?: Element;
  /* Why this library is defined */
  purpose?: markdown;
  /* Natural language description of the library */
  description?: markdown;
  /* Name for this library (computer friendly) */
  name?: string;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  identifier?: Identifier;
  /* Canonical identifier for this library, represented as a URI (globally unique) */
  url?: uri;
  /* Business version of the library */
  version?: string;
  topic?: CodeableConcept;
  contact?: ContactDetail;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _purpose?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* logic-library | model-definition | asset-collection | module-definition */
  'type': CodeableConcept;
  _lastReviewDate?: Element;
  parameter?: ParameterDefinition;
  /* Describes the clinical usage of the library */
  usage?: string;
  _publisher?: Element;
  relatedArtifact?: RelatedArtifact;
  /* When the library is expected to be used */
  effectivePeriod?: Period;
  /* Subordinate title of the library */
  subtitle?: string;
  dataRequirement?: DataRequirement;
  _experimental?: Element;
  _copyright?: Element;
  _version?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  useContext?: UsageContext;
  reviewer?: ContactDetail;
  /* Date last changed */
  date?: dateTime;
  author?: ContactDetail;
  _url?: Element;
  /* Type of individual the library content is focused on */
  subject?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Group'>;
  };
  _name?: Element;
  endorser?: ContactDetail;
  jurisdiction?: CodeableConcept;
  _usage?: Element;
  /* When the library was last reviewed */
  lastReviewDate?: date;
  _approvalDate?: Element;
  _title?: Element;
  /* When the library was approved by publisher */
  approvalDate?: date;
  /* Name for this library (human friendly) */
  title?: string;
  _description?: Element;
  _subtitle?: Element;
  editor?: ContactDetail;
  content?: Attachment;
}

/* Audience Group from patient list */
export interface AudienceGroup extends Resource<'AudienceGroup'> {
  criteria?: {
    organization?: Array<Reference<'Organization'>>;
    practitioner?: Array<Reference<'PractitionerRole'>>;
    endDate?: string;
    healthcareService?: Array<Reference<'HealthcareService'>>;
    startDate?: string;
  };
  systemAccount?: Reference<'SystemAccount'>;
  'type': 'patient-list' | 'criteria';
  status?: {
    failed?: number;
    succeed?: number;
    step?: 'parsing' | 'done' | 'error';
  };
  name: string;
}

export interface replyPolicySchema {
  timeout?: '24' | 'none' | 'day-before';
  mode?: 'business' | 'default';
  template?: string;
}

/* A record of a request for a medication, substance or device used in the healthcare setting. */
export interface SupplyRequest extends DomainResource, Resource<'SupplyRequest'> {
  /* draft | active | suspended + */
  status?: 'active' | 'cancelled' | 'completed' | 'draft' | 'entered-in-error' | 'suspended' | 'unknown';
  _priority?: Element;
  /* The origin of the supply */
  deliverFrom?: Reference<'Organization' | 'Location'>;
  reasonCode?: CodeableConcept;
  supplier?: Array<Reference<'Organization' | 'HealthcareService'>>;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  reasonReference?: Array<Reference<'DiagnosticReport' | 'DocumentReference' | 'Observation' | 'Condition'>>;
  /* The kind of supply (central, non-stock, etc.) */
  category?: CodeableConcept;
  /* Medication, Substance, or Device requested to be supplied */
  item?: {
    Reference?: Reference<'Device' | 'Medication' | 'Substance'>;
    CodeableConcept?: CodeableConcept;
  };
  parameter?: {
    /* Item detail */
    code?: CodeableConcept;
    /* Value of detail */
    value?: {
      CodeableConcept?: CodeableConcept;
      _boolean?: Element;
      boolean?: boolean;
      Range?: Range;
      Quantity?: Quantity;
    };
  };
  /* Individual making the request */
  requester?: Reference<'Patient' | 'Device' | 'RelatedPerson' | 'PractitionerRole' | 'Practitioner' | 'Organization'>;
  _status?: Element;
  /* The destination of the supply */
  deliverTo?: Reference<'Location' | 'Organization' | 'Patient'>;
  /* When the request was made */
  authoredOn?: dateTime;
  identifier?: Identifier;
  /* When the request should be fulfilled */
  occurrence?: {
    Timing?: Timing;
    Period?: Period;
    _dateTime?: Element;
    dateTime?: dateTime;
  };
  /* The requested amount of the item indicated */
  quantity: Quantity;
  _authoredOn?: Element;
}

/* Describes a measurement, calculation or setting capability of a medical device. */
export interface DeviceMetric extends DomainResource, Resource<'DeviceMetric'> {
  /* Identity of metric, for example Heart Rate or PEEP Setting */
  'type': '532353' | '532354' | '532355' | '68219' | '68220' | '68221' | '68222' | '68223' | '68224' | '68226';
  /* on | off | standby | entered-in-error */
  operationalStatus?: 'entered-in-error' | 'off' | 'on' | 'standby';
  /* measurement | setting | calculation | unspecified */
  category: 'calculation' | 'measurement' | 'setting' | 'unspecified';
  /* Describes the link to the source Device */
  source?: Reference<'Device'>;
  /* Unit of Measure for the Metric */
  unit?: '532353' | '532354' | '532355' | '68219' | '68220' | '68221' | '68222' | '68223' | '68224' | '68226';
  identifier?: Identifier;
  /* Describes the measurement repetition time */
  measurementPeriod?: Timing;
  _category?: Element;
  _color?: Element;
  /* black | red | green | yellow | blue | magenta | cyan | white */
  color?: 'black' | 'blue' | 'cyan' | 'green' | 'magenta' | 'red' | 'white' | 'yellow';
  /* Describes the link to the parent Device */
  parent?: Reference<'Device'>;
  _operationalStatus?: Element;
  calibration?: {
    /* not-calibrated | calibration-required | calibrated | unspecified */
    state?: 'calibrated' | 'calibration-required' | 'not-calibrated' | 'unspecified';
    _time?: Element;
    _state?: Element;
    /* unspecified | offset | gain | two-point */
    'type'?: 'gain' | 'offset' | 'two-point' | 'unspecified';
    /* Describes the time last calibration has been performed */
    time?: instant;
    _type?: Element;
  };
}

/* A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */
export interface TestScript extends DomainResource, Resource<'TestScript'> {
  _publisher?: Element;
  useContext?: UsageContext;
  /* Canonical identifier for this test script, represented as a URI (globally unique) */
  url: uri;
  _purpose?: Element;
  _date?: Element;
  _name?: Element;
  /* Business version of the test script */
  version?: string;
  _experimental?: Element;
  /* Required capability that is assumed to function correctly on the FHIR server being tested */
  metadata?: {
    link?: {
      _description?: Element;
      _url?: Element;
      /* Short description */
      description?: string;
      /* URL to the specification */
      url: uri;
    };
    capability: {
      /* Required Capability Statement */
      capabilities: canonical;
      /* Which server these requirements apply to */
      destination?: integer;
      /* Are the capabilities validated? */
      validated: boolean;
      link?: uri;
      /* Are the capabilities required? */
      required: boolean;
      _required?: Element;
      _destination?: Element;
      /* The expected capabilities of the server */
      description?: string;
      _capabilities?: Element;
      _description?: Element;
      _origin?: Element;
      _validated?: Element;
      origin?: integer;
      _link?: Element;
    };
  };
  /* Additional identifier for the test script */
  identifier?: Identifier;
  _title?: Element;
  /* A series of required clean up steps */
  teardown?: {
    action: {
      /* The teardown operation to perform */
      operation: any;
    };
  };
  fixture?: {
    /* Reference of the resource */
    resource?: Reference<'Reference'>;
    _autodelete?: Element;
    _autocreate?: Element;
    /* Whether or not to implicitly create the fixture during setup */
    autocreate: boolean;
    /* Whether or not to implicitly delete the fixture during teardown */
    autodelete: boolean;
  };
  test?: {
    _description?: Element;
    /* Tracking/logging name of this test */
    name?: string;
    _name?: Element;
    action: {
      /* The setup assertion to perform */
      assert?: any;
      /* The setup operation to perform */
      operation?: any;
    };
    /* Tracking/reporting short description of the test */
    description?: string;
  };
  /* A series of required setup operations before tests are executed */
  setup?: {
    action: {
      /* The setup operation to perform */
      operation?: {
        _url?: Element;
        requestHeader?: {
          _field?: Element;
          /* HTTP headerfield value */
          value: string;
          _value?: Element;
          /* HTTP header field name */
          field: string;
        };
        _method?: Element;
        /* delete | get | options | patch | post | put | head */
        method?: 'delete' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'get';
        _contentType?: Element;
        _params?: Element;
        /* Tracking/reporting operation description */
        description?: string;
        /* Server initiating the request */
        origin?: integer;
        _responseId?: Element;
        /* Mime type of the request payload contents, with charset etc. */
        contentType?: 'application/hl7-cda+xml';
        /* Server responding to the request */
        destination?: integer;
        _description?: Element;
        /* Fixture Id of mapped response */
        responseId?: id;
        _encodeRequestUrl?: Element;
        _label?: Element;
        /* Mime type to accept in the payload of the response, with charset etc. */
        accept?: 'application/hl7-cda+xml';
        /* Whether or not to send the request url in encoded format */
        encodeRequestUrl: boolean;
        /* Fixture Id of mapped request */
        requestId?: id;
        /* Id of fixture used for extracting the [id],  [type], and [vid] for GET requests */
        targetId?: id;
        _requestId?: Element;
        _sourceId?: Element;
        /* Request URL */
        url?: string;
        _destination?: Element;
        _resource?: Element;
        /* The operation code type that will be executed */
        'type'?: Coding;
        /* Tracking/logging operation label */
        label?: string;
        /* Resource type */
        resource?:
          | 'Address'
          | 'Age'
          | 'Annotation'
          | 'Attachment'
          | 'BackboneElement'
          | 'base64Binary'
          | 'boolean'
          | 'canonical'
          | 'code'
          | 'CodeableConcept'
          | 'Coding'
          | 'ContactDetail'
          | 'ContactPoint'
          | 'Contributor'
          | 'Count'
          | 'DataRequirement'
          | 'date'
          | 'dateTime'
          | 'decimal'
          | 'Distance'
          | 'Dosage'
          | 'Duration'
          | 'Element'
          | 'ElementDefinition'
          | 'Expression'
          | 'Extension'
          | 'HumanName'
          | 'id'
          | 'Identifier'
          | 'instant'
          | 'integer'
          | 'markdown'
          | 'MarketingStatus'
          | 'Meta'
          | 'Money'
          | 'MoneyQuantity'
          | 'Narrative'
          | 'oid'
          | 'ParameterDefinition'
          | 'Period'
          | 'Population'
          | 'positiveInt'
          | 'ProdCharacteristic'
          | 'ProductShelfLife'
          | 'Quantity'
          | 'Range'
          | 'Ratio'
          | 'Reference'
          | 'RelatedArtifact'
          | 'SampledData'
          | 'Signature'
          | 'string'
          | 'SubstanceAmount'
          | 'time'
          | 'Timing'
          | 'TriggerDefinition'
          | 'unsignedInt'
          | 'uri'
          | 'url'
          | 'UsageContext'
          | 'uuid'
          | 'xhtml'
          | 'Account'
          | 'ActivityDefinition'
          | 'AdverseEvent'
          | 'AllergyIntolerance'
          | 'Appointment'
          | 'AppointmentResponse'
          | 'AuditEvent'
          | 'Basic'
          | 'Binary'
          | 'BiologicallyDerivedProduct'
          | 'BodyStructure'
          | 'Bundle'
          | 'CapabilityStatement'
          | 'CarePlan'
          | 'CareTeam'
          | 'CatalogEntry'
          | 'ChargeItem'
          | 'ChargeItemDefinition'
          | 'Claim'
          | 'ClaimResponse'
          | 'ClinicalImpression'
          | 'CodeSystem'
          | 'Communication'
          | 'CommunicationRequest'
          | 'CompartmentDefinition'
          | 'Composition'
          | 'ConceptMap'
          | 'Condition'
          | 'Consent'
          | 'Contract'
          | 'Coverage'
          | 'CoverageEligibilityRequest'
          | 'CoverageEligibilityResponse'
          | 'DetectedIssue'
          | 'Device'
          | 'DeviceDefinition'
          | 'DeviceMetric'
          | 'DeviceRequest';
        _origin?: Element;
        _accept?: Element;
        _targetId?: Element;
        /* Explicitly defined path parameters */
        params?: string;
        /* Fixture Id of body for PUT and POST requests */
        sourceId?: id;
      };
      /* The assertion to perform */
      assert?: {
        _path?: Element;
        _expression?: Element;
        /* Perform validation on navigation links? */
        navigationLinks?: boolean;
        _responseCode?: Element;
        /* Resource type */
        resource?:
          | 'Address'
          | 'Age'
          | 'Annotation'
          | 'Attachment'
          | 'BackboneElement'
          | 'base64Binary'
          | 'boolean'
          | 'canonical'
          | 'code'
          | 'CodeableConcept'
          | 'Coding'
          | 'ContactDetail'
          | 'ContactPoint'
          | 'Contributor'
          | 'Count'
          | 'DataRequirement'
          | 'date'
          | 'dateTime'
          | 'decimal'
          | 'Distance'
          | 'Dosage'
          | 'Duration'
          | 'Element'
          | 'ElementDefinition'
          | 'Expression'
          | 'Extension'
          | 'HumanName'
          | 'id'
          | 'Identifier'
          | 'instant'
          | 'integer'
          | 'markdown'
          | 'MarketingStatus'
          | 'Meta'
          | 'Money'
          | 'MoneyQuantity'
          | 'Narrative'
          | 'oid'
          | 'ParameterDefinition'
          | 'Period'
          | 'Population'
          | 'positiveInt'
          | 'ProdCharacteristic'
          | 'ProductShelfLife'
          | 'Quantity'
          | 'Range'
          | 'Ratio'
          | 'Reference'
          | 'RelatedArtifact'
          | 'SampledData'
          | 'Signature'
          | 'string'
          | 'SubstanceAmount'
          | 'time'
          | 'Timing'
          | 'TriggerDefinition'
          | 'unsignedInt'
          | 'uri'
          | 'url'
          | 'UsageContext'
          | 'uuid'
          | 'xhtml'
          | 'Account'
          | 'ActivityDefinition'
          | 'AdverseEvent'
          | 'AllergyIntolerance'
          | 'Appointment'
          | 'AppointmentResponse'
          | 'AuditEvent'
          | 'Basic'
          | 'Binary'
          | 'BiologicallyDerivedProduct'
          | 'BodyStructure'
          | 'Bundle'
          | 'CapabilityStatement'
          | 'CarePlan'
          | 'CareTeam'
          | 'CatalogEntry'
          | 'ChargeItem'
          | 'ChargeItemDefinition'
          | 'Claim'
          | 'ClaimResponse'
          | 'ClinicalImpression'
          | 'CodeSystem'
          | 'Communication'
          | 'CommunicationRequest'
          | 'CompartmentDefinition'
          | 'Composition'
          | 'ConceptMap'
          | 'Condition'
          | 'Consent'
          | 'Contract'
          | 'Coverage'
          | 'CoverageEligibilityRequest'
          | 'CoverageEligibilityResponse'
          | 'DetectedIssue'
          | 'Device'
          | 'DeviceDefinition'
          | 'DeviceMetric'
          | 'DeviceRequest';
        /* HTTP response code to test */
        responseCode?: string;
        _headerField?: Element;
        _compareToSourceExpression?: Element;
        /* The FHIRPath expression to evaluate against the source fixture */
        compareToSourceExpression?: string;
        _resource?: Element;
        /* Tracking/logging assertion label */
        label?: string;
        /* okay | created | noContent | notModified | bad | forbidden | notFound | methodNotAllowed | conflict | gone | preconditionFailed | unprocessable */
        response?:
          | 'bad'
          | 'conflict'
          | 'created'
          | 'forbidden'
          | 'gone'
          | 'methodNotAllowed'
          | 'noContent'
          | 'notFound'
          | 'notModified'
          | 'okay'
          | 'preconditionFailed'
          | 'unprocessable';
        _description?: Element;
        _label?: Element;
        _requestURL?: Element;
        _value?: Element;
        _direction?: Element;
        /* The FHIRPath expression to be evaluated */
        expression?: string;
        /* Fixture Id of minimum content resource */
        minimumId?: string;
        _navigationLinks?: Element;
        /* Request URL comparison value */
        requestURL?: string;
        /* Tracking/reporting assertion description */
        description?: string;
        _operator?: Element;
        /* The value to compare to */
        value?: string;
        /* delete | get | options | patch | post | put | head */
        requestMethod?: 'delete' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'get';
        _validateProfileId?: Element;
        /* Id of the source fixture to be evaluated */
        compareToSourceId?: string;
        /* XPath or JSONPath expression to evaluate against the source fixture */
        compareToSourcePath?: string;
        /* response | request */
        direction?: 'request' | 'response';
        /* Profile Id of validation profile reference */
        validateProfileId?: id;
        /* Fixture Id of source expression or headerField */
        sourceId?: id;
        /* Will this assert produce a warning only on error? */
        warningOnly: boolean;
        _compareToSourceId?: Element;
        _contentType?: Element;
        _minimumId?: Element;
        _requestMethod?: Element;
        /* Mime type to compare against the 'Content-Type' header */
        contentType?: 'application/hl7-cda+xml';
        _compareToSourcePath?: Element;
        _response?: Element;
        /* equals | notEquals | in | notIn | greaterThan | lessThan | empty | notEmpty | contains | notContains | eval */
        operator?:
          | 'contains'
          | 'empty'
          | 'equals'
          | 'eval'
          | 'greaterThan'
          | 'in'
          | 'lessThan'
          | 'notContains'
          | 'notEmpty'
          | 'notEquals'
          | 'notIn';
        _sourceId?: Element;
        /* HTTP header field name */
        headerField?: string;
        _warningOnly?: Element;
        /* XPath or JSONPath expression */
        path?: string;
      };
    };
  };
  variable?: {
    _expression?: Element;
    /* XPath or JSONPath against the fixture body */
    path?: string;
    _headerField?: Element;
    _path?: Element;
    /* Natural language description of the variable */
    description?: string;
    /* HTTP header field name for source */
    headerField?: string;
    _description?: Element;
    /* Hint help text for default value to enter */
    hint?: string;
    /* Descriptive name for this variable */
    name: string;
    /* Default, hard-coded, or user-defined value for this variable */
    defaultValue?: string;
    _hint?: Element;
    _name?: Element;
    _sourceId?: Element;
    /* The FHIRPath expression against the fixture body */
    expression?: string;
    /* Fixture Id of source expression or headerField within this variable */
    sourceId?: id;
    _defaultValue?: Element;
  };
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _description?: Element;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  contact?: ContactDetail;
  /* Natural language description of the test script */
  description?: markdown;
  destination?: {
    /* The index of the abstract destination server starting at 1 */
    index: integer;
    /* FHIR-Server | FHIR-SDC-FormManager | FHIR-SDC-FormReceiver | FHIR-SDC-FormProcessor */
    profile: Coding;
    _index?: Element;
  };
  _url?: Element;
  _version?: Element;
  jurisdiction?: CodeableConcept;
  /* Why this test script is defined */
  purpose?: markdown;
  /* Name for this test script (computer friendly) */
  name: string;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  origin?: {
    _index?: Element;
    /* The index of the abstract origin server starting at 1 */
    index: integer;
    /* FHIR-Client | FHIR-SDC-FormFiller */
    profile: Coding;
  };
  /* Date last changed */
  date?: dateTime;
  _status?: Element;
  _copyright?: Element;
  /* Name for this test script (human friendly) */
  title?: string;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  profile?: Array<Reference<'Reference'>>;
}

/* A numeric value that allows the comparison (less than, greater than) or other numerical
manipulation of a concept (e.g. Adding up components of a score). Scores are usually a whole number, but occasionally decimals are encountered in scores. */
export type ordinalValue = decimal;
/* Base StructureDefinition for SampledData Type: A series of measurements taken by a device, with upper and lower limits. There may be more than one dimension in the data. */
export interface SampledData extends Element {
  /* Upper limit of detection */
  upperLimit?: decimal;
  /* Multiply data by this before adding to origin */
  factor?: decimal;
  /* Decimal values with spaces, or "E" | "U" | "L" */
  data?: string;
  _data?: Element;
  _lowerLimit?: Element;
  /* Zero value and units */
  origin: Quantity;
  _dimensions?: Element;
  _period?: Element;
  _factor?: Element;
  _upperLimit?: Element;
  /* Lower limit of detection */
  lowerLimit?: decimal;
  /* Number of milliseconds between samples */
  period: decimal;
  /* Number of sample points at each time point */
  dimensions: positiveInt;
}

/* A homogeneous material with a definite composition. */
export interface Substance extends DomainResource, Resource<'Substance'> {
  _description?: Element;
  _status?: Element;
  category?: CodeableConcept;
  instance?: {
    /* Identifier of the package/container */
    identifier?: Identifier;
    _expiry?: Element;
    /* Amount of substance in the package */
    quantity?: Quantity;
    /* When no longer valid to use */
    expiry?: dateTime;
  };
  /* active | inactive | entered-in-error */
  status?: 'active' | 'entered-in-error' | 'inactive';
  ingredient?: {
    /* Optional amount (concentration) */
    quantity?: Ratio;
    /* A component of the substance */
    substance?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'Substance'>;
    };
  };
  /* What substance this is */
  code: CodeableConcept;
  /* Textual description of the substance, comments */
  description?: string;
  identifier?: Identifier;
}

export type RPCtruncate = {
  method: 'rpc.elastic/truncate';
  params: {
    [key: string]: any;
  };
};
/* A resource that includes narrative, extensions, and contained resources. */
export interface DomainResource {
  contained?: Resource;
  /* Text summary of the resource, for human interpretation */
  text?: Narrative;
  extension?: Extension;
  modifierExtension?: Extension;
}

/* Base StructureDefinition for canonical type: A URI that is a reference to a canonical URL on a FHIR resource */
export type canonical = string;
/* Indicates a resource that this resource is replacing. */
export type replaces = canonical;
/* A search parameter that defines a named search item that can be used to search/filter on a resource. */
export interface SearchParameter extends DomainResource, Resource<'SearchParameter'> {
  /* number | date | string | token | reference | composite | quantity | uri | special */
  'type': 'composite' | 'date' | 'number' | 'quantity' | 'reference' | 'special' | 'string' | 'token' | 'uri';
  _date?: Element;
  _multipleAnd?: Element;
  _name?: Element;
  _chain?: Element;
  /* Original definition for the search parameter */
  derivedFrom?: canonical;
  _version?: Element;
  _derivedFrom?: Element;
  _purpose?: Element;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _xpath?: Element;
  /* Allow multiple values per parameter (or) */
  multipleOr?: boolean;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Canonical identifier for this search parameter, represented as a URI (globally unique) */
  url: uri;
  _multipleOr?: Element;
  _modifier?: Element;
  comparator?: Array<'ap' | 'eb' | 'eq' | 'ge' | 'gt' | 'le' | 'lt' | 'ne' | 'sa'>;
  _type?: Element;
  _publisher?: Element;
  _xpathUsage?: Element;
  /* Natural language description of the search parameter */
  description: markdown;
  _url?: Element;
  /* FHIRPath expression that extracts the values */
  expression?: string;
  /* Allow multiple parameters (and) */
  multipleAnd?: boolean;
  /* Why this search parameter is defined */
  purpose?: markdown;
  _target?: Element;
  _code?: Element;
  base: Array<
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition'
    | 'DeviceMetric'
    | 'DeviceRequest'
    | 'DeviceUseStatement'
    | 'DiagnosticReport'
    | 'DocumentManifest'
    | 'DocumentReference'
    | 'DomainResource'
    | 'EffectEvidenceSynthesis'
    | 'Encounter'
    | 'Endpoint'
    | 'EnrollmentRequest'
    | 'EnrollmentResponse'
    | 'EpisodeOfCare'
    | 'EventDefinition'
    | 'Evidence'
    | 'EvidenceVariable'
    | 'ExampleScenario'
    | 'ExplanationOfBenefit'
    | 'FamilyMemberHistory'
    | 'Flag'
    | 'Goal'
    | 'GraphDefinition'
    | 'Group'
    | 'GuidanceResponse'
    | 'HealthcareService'
    | 'ImagingStudy'
    | 'Immunization'
    | 'ImmunizationEvaluation'
    | 'ImmunizationRecommendation'
    | 'ImplementationGuide'
    | 'InsurancePlan'
    | 'Invoice'
    | 'Library'
    | 'Linkage'
    | 'List'
    | 'Location'
    | 'Measure'
    | 'MeasureReport'
    | 'Media'
    | 'Medication'
    | 'MedicationAdministration'
    | 'MedicationDispense'
    | 'MedicationKnowledge'
    | 'MedicationRequest'
    | 'MedicationStatement'
    | 'MedicinalProduct'
    | 'MedicinalProductAuthorization'
    | 'MedicinalProductContraindication'
    | 'MedicinalProductIndication'
    | 'MedicinalProductIngredient'
    | 'MedicinalProductInteraction'
    | 'MedicinalProductManufactured'
    | 'MedicinalProductPackaged'
    | 'MedicinalProductPharmaceutical'
    | 'MedicinalProductUndesirableEffect'
    | 'MessageDefinition'
    | 'MessageHeader'
    | 'MolecularSequence'
    | 'NamingSystem'
    | 'NutritionOrder'
    | 'Observation'
    | 'ObservationDefinition'
    | 'OperationDefinition'
    | 'OperationOutcome'
  >;
  contact?: ContactDetail;
  chain?: string;
  /* Date last changed */
  date?: dateTime;
  target?: Array<
    | 'Account'
    | 'ActivityDefinition'
    | 'AdverseEvent'
    | 'AllergyIntolerance'
    | 'Appointment'
    | 'AppointmentResponse'
    | 'AuditEvent'
    | 'Basic'
    | 'Binary'
    | 'BiologicallyDerivedProduct'
    | 'BodyStructure'
    | 'Bundle'
    | 'CapabilityStatement'
    | 'CarePlan'
    | 'CareTeam'
    | 'CatalogEntry'
    | 'ChargeItem'
    | 'ChargeItemDefinition'
    | 'Claim'
    | 'ClaimResponse'
    | 'ClinicalImpression'
    | 'CodeSystem'
    | 'Communication'
    | 'CommunicationRequest'
    | 'CompartmentDefinition'
    | 'Composition'
    | 'ConceptMap'
    | 'Condition'
    | 'Consent'
    | 'Contract'
    | 'Coverage'
    | 'CoverageEligibilityRequest'
    | 'CoverageEligibilityResponse'
    | 'DetectedIssue'
    | 'Device'
    | 'DeviceDefinition'
    | 'DeviceMetric'
    | 'DeviceRequest'
    | 'DeviceUseStatement'
    | 'DiagnosticReport'
    | 'DocumentManifest'
    | 'DocumentReference'
    | 'DomainResource'
    | 'EffectEvidenceSynthesis'
    | 'Encounter'
    | 'Endpoint'
    | 'EnrollmentRequest'
    | 'EnrollmentResponse'
    | 'EpisodeOfCare'
    | 'EventDefinition'
    | 'Evidence'
    | 'EvidenceVariable'
    | 'ExampleScenario'
    | 'ExplanationOfBenefit'
    | 'FamilyMemberHistory'
    | 'Flag'
    | 'Goal'
    | 'GraphDefinition'
    | 'Group'
    | 'GuidanceResponse'
    | 'HealthcareService'
    | 'ImagingStudy'
    | 'Immunization'
    | 'ImmunizationEvaluation'
    | 'ImmunizationRecommendation'
    | 'ImplementationGuide'
    | 'InsurancePlan'
    | 'Invoice'
    | 'Library'
    | 'Linkage'
    | 'List'
    | 'Location'
    | 'Measure'
    | 'MeasureReport'
    | 'Media'
    | 'Medication'
    | 'MedicationAdministration'
    | 'MedicationDispense'
    | 'MedicationKnowledge'
    | 'MedicationRequest'
    | 'MedicationStatement'
    | 'MedicinalProduct'
    | 'MedicinalProductAuthorization'
    | 'MedicinalProductContraindication'
    | 'MedicinalProductIndication'
    | 'MedicinalProductIngredient'
    | 'MedicinalProductInteraction'
    | 'MedicinalProductManufactured'
    | 'MedicinalProductPackaged'
    | 'MedicinalProductPharmaceutical'
    | 'MedicinalProductUndesirableEffect'
    | 'MessageDefinition'
    | 'MessageHeader'
    | 'MolecularSequence'
    | 'NamingSystem'
    | 'NutritionOrder'
    | 'Observation'
    | 'ObservationDefinition'
    | 'OperationDefinition'
    | 'OperationOutcome'
  >;
  useContext?: UsageContext;
  /* Name for this search parameter (computer friendly) */
  name: string;
  _base?: Element;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* XPath that extracts the values */
  xpath?: string;
  jurisdiction?: CodeableConcept;
  /* Business version of the search parameter */
  version?: string;
  /* Code used in URL */
  code: code;
  _status?: Element;
  _description?: Element;
  _experimental?: Element;
  modifier?: Array<
    | 'above'
    | 'below'
    | 'contains'
    | 'exact'
    | 'identifier'
    | 'in'
    | 'missing'
    | 'not'
    | 'not-in'
    | 'ofType'
    | 'text'
    | 'type'
  >;
  component?: {
    _definition?: Element;
    /* Subexpression relative to main expression */
    expression: string;
    _expression?: Element;
    /* Defines how the part works */
    definition: canonical;
  };
  _expression?: Element;
  _comparator?: Element;
  /* normal | phonetic | nearby | distance | other */
  xpathUsage?: 'distance' | 'nearby' | 'normal' | 'other' | 'phonetic';
}

/* Defines the characteristics of a message that can be shared between systems, including the type of event that initiates the message, the content to be transmitted and what response(s), if any, are permitted. */
export interface MessageDefinition extends DomainResource, Resource<'MessageDefinition'> {
  _publisher?: Element;
  /* Event code  or link to the EventDefinition */
  event?: {
    Coding?: Coding;
    uri?: uri;
    _uri?: Element;
  };
  _description?: Element;
  _category?: Element;
  _experimental?: Element;
  _purpose?: Element;
  /* Name for this message definition (computer friendly) */
  name?: string;
  /* always | on-error | never | on-success */
  responseRequired?: 'always' | 'never' | 'on-error' | 'on-success';
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _version?: Element;
  /* Business version of the message definition */
  version?: string;
  _status?: Element;
  graph?: canonical;
  _responseRequired?: Element;
  /* Natural language description of the message definition */
  description?: markdown;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Definition this one is based on */
  base?: canonical;
  useContext?: UsageContext;
  parent?: canonical;
  /* Business Identifier for a given MessageDefinition */
  url?: uri;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  _date?: Element;
  _name?: Element;
  _parent?: Element;
  _base?: Element;
  replaces?: canonical;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  contact?: ContactDetail;
  /* consequence | currency | notification */
  category?: 'consequence' | 'currency' | 'notification';
  identifier?: Identifier;
  /* Why this message definition is defined */
  purpose?: markdown;
  focus?: {
    /* Profile that must be adhered to by focus */
    profile?: canonical;
    _min?: Element;
    _max?: Element;
    _profile?: Element;
    /* Type of resource */
    code:
      | 'Account'
      | 'ActivityDefinition'
      | 'AdverseEvent'
      | 'AllergyIntolerance'
      | 'Appointment'
      | 'AppointmentResponse'
      | 'AuditEvent'
      | 'Basic'
      | 'Binary'
      | 'BiologicallyDerivedProduct'
      | 'BodyStructure'
      | 'Bundle'
      | 'CapabilityStatement'
      | 'CarePlan'
      | 'CareTeam'
      | 'CatalogEntry'
      | 'ChargeItem'
      | 'ChargeItemDefinition'
      | 'Claim'
      | 'ClaimResponse'
      | 'ClinicalImpression'
      | 'CodeSystem'
      | 'Communication'
      | 'CommunicationRequest'
      | 'CompartmentDefinition'
      | 'Composition'
      | 'ConceptMap'
      | 'Condition'
      | 'Consent'
      | 'Contract'
      | 'Coverage'
      | 'CoverageEligibilityRequest'
      | 'CoverageEligibilityResponse'
      | 'DetectedIssue'
      | 'Device'
      | 'DeviceDefinition'
      | 'DeviceMetric'
      | 'DeviceRequest'
      | 'DeviceUseStatement'
      | 'DiagnosticReport'
      | 'DocumentManifest'
      | 'DocumentReference'
      | 'DomainResource'
      | 'EffectEvidenceSynthesis'
      | 'Encounter'
      | 'Endpoint'
      | 'EnrollmentRequest'
      | 'EnrollmentResponse'
      | 'EpisodeOfCare'
      | 'EventDefinition'
      | 'Evidence'
      | 'EvidenceVariable'
      | 'ExampleScenario'
      | 'ExplanationOfBenefit'
      | 'FamilyMemberHistory'
      | 'Flag'
      | 'Goal'
      | 'GraphDefinition'
      | 'Group'
      | 'GuidanceResponse'
      | 'HealthcareService'
      | 'ImagingStudy'
      | 'Immunization'
      | 'ImmunizationEvaluation'
      | 'ImmunizationRecommendation'
      | 'ImplementationGuide'
      | 'InsurancePlan'
      | 'Invoice'
      | 'Library'
      | 'Linkage'
      | 'List'
      | 'Location'
      | 'Measure'
      | 'MeasureReport'
      | 'Media'
      | 'Medication'
      | 'MedicationAdministration'
      | 'MedicationDispense'
      | 'MedicationKnowledge'
      | 'MedicationRequest'
      | 'MedicationStatement'
      | 'MedicinalProduct'
      | 'MedicinalProductAuthorization'
      | 'MedicinalProductContraindication'
      | 'MedicinalProductIndication'
      | 'MedicinalProductIngredient'
      | 'MedicinalProductInteraction'
      | 'MedicinalProductManufactured'
      | 'MedicinalProductPackaged'
      | 'MedicinalProductPharmaceutical'
      | 'MedicinalProductUndesirableEffect'
      | 'MessageDefinition'
      | 'MessageHeader'
      | 'MolecularSequence'
      | 'NamingSystem'
      | 'NutritionOrder'
      | 'Observation'
      | 'ObservationDefinition'
      | 'OperationDefinition'
      | 'OperationOutcome';
    /* Minimum number of focuses of this type */
    min: unsignedInt;
    /* Maximum number of focuses of this type */
    max?: string;
    _code?: Element;
  };
  _replaces?: Element;
  jurisdiction?: CodeableConcept;
  _copyright?: Element;
  _title?: Element;
  allowedResponse?: {
    _situation?: Element;
    _message?: Element;
    /* When should this response be used */
    situation?: markdown;
    /* Reference to allowed message definition response */
    message: canonical;
  };
  /* Name for this message definition (human friendly) */
  title?: string;
  _graph?: Element;
  _url?: Element;
  /* Date last changed */
  date: dateTime;
}

export type RPCsetAutoSync = {
  method: 'dash.account/set-auto-sync';
  params: {
    'auto-sync'?: boolean;
    account: string;
  };
};
/* Base StructureDefinition for decimal Type: A rational number with implicit precision */
export type decimal = number;
export type RPCgetDoctor = {
  method: 'relatient.self-scheduling/get-doctor';
  params: {
    [key: string]: any;
  };
};
/* Catalog entries are wrappers that contextualize items included in a catalog. */
export interface CatalogEntry extends DomainResource, Resource<'CatalogEntry'> {
  /* The type of item - medication, device, service, protocol or other */
  'type'?: CodeableConcept;
  /* The item that is being defined */
  referencedItem: Reference<
    | 'SpecimenDefinition'
    | 'ActivityDefinition'
    | 'Medication'
    | 'HealthcareService'
    | 'Device'
    | 'ObservationDefinition'
    | 'Practitioner'
    | 'PlanDefinition'
    | 'PractitionerRole'
    | 'Binary'
    | 'Organization'
  >;
  additionalIdentifier?: Identifier;
  /* draft | active | retired | unknown */
  status?: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _validTo?: Element;
  /* When was this catalog last updated */
  lastUpdated?: dateTime;
  /* The time period in which this catalog entry is expected to be active */
  validityPeriod?: Period;
  /* The date until which this catalog entry is expected to be active */
  validTo?: dateTime;
  additionalClassification?: CodeableConcept;
  _lastUpdated?: Element;
  _status?: Element;
  _orderable?: Element;
  classification?: CodeableConcept;
  /* Whether the entry represents an orderable item */
  orderable: boolean;
  additionalCharacteristic?: CodeableConcept;
  relatedEntry?: {
    _relationtype?: Element;
    /* triggers | is-replaced-by */
    relationtype: 'is-replaced-by' | 'triggers';
    /* The reference to the related item */
    item: Reference<'CatalogEntry'>;
  };
  identifier?: Identifier;
}

/* Base StructureDefinition for UsageContext Type: Specifies clinical/business/etc. metadata that can be used to retrieve, index and/or categorize an artifact. This metadata can either be specific to the applicable population (e.g., age category, DRG) or the specific context of care (e.g., venue, care setting, provider of care). */
export interface UsageContext extends Element {
  /* Type of context being specified */
  code: Coding;
  /* Value that defines the context */
  value?: {
    CodeableConcept?: CodeableConcept;
    Quantity?: Quantity;
    Range?: Range;
    Reference?: Reference<
      'Organization' | 'Group' | 'Location' | 'PlanDefinition' | 'InsurancePlan' | 'HealthcareService' | 'ResearchStudy'
    >;
  };
}

/* A physical entity which is the primary unit of operational and/or administrative interest in a study. */
export interface ResearchSubject extends DomainResource, Resource<'ResearchSubject'> {
  /* What path should be followed */
  assignedArm?: string;
  _actualArm?: Element;
  /* Study subject is part of */
  study: Reference<'ResearchStudy'>;
  /* Start and end of participation */
  period?: Period;
  /* Who is part of study */
  individual: Reference<'Patient'>;
  /* candidate | eligible | follow-up | ineligible | not-registered | off-study | on-study | on-study-intervention | on-study-observation | pending-on-study | potential-candidate | screening | withdrawn */
  status:
    | 'candidate'
    | 'eligible'
    | 'follow-up'
    | 'ineligible'
    | 'not-registered'
    | 'off-study'
    | 'on-study'
    | 'on-study-intervention'
    | 'on-study-observation'
    | 'pending-on-study'
    | 'potential-candidate'
    | 'screening'
    | 'withdrawn';
  /* What path was followed */
  actualArm?: string;
  _status?: Element;
  identifier?: Identifier;
  /* Agreement to participate in study */
  consent?: Reference<'Consent'>;
  _assignedArm?: Element;
}

/* This resource provides the adjudication details from the processing of a Claim resource. */
export interface ClaimResponse extends DomainResource, Resource<'ClaimResponse'> {
  /* claim | preauthorization | predetermination */
  use: 'claim' | 'preauthorization' | 'predetermination';
  processNote?: {
    _number?: Element;
    /* Note instance identifier */
    number?: positiveInt;
    _type?: Element;
    /* Note explanatory text */
    text: string;
    /* Language of the text */
    language?:
      | 'ar'
      | 'bn'
      | 'cs'
      | 'da'
      | 'de'
      | 'de-AT'
      | 'de-CH'
      | 'de-DE'
      | 'el'
      | 'en'
      | 'en-AU'
      | 'en-CA'
      | 'en-GB'
      | 'en-IN'
      | 'en-NZ'
      | 'en-SG'
      | 'en-US'
      | 'es'
      | 'es-AR'
      | 'es-ES'
      | 'es-UY'
      | 'fi'
      | 'fr'
      | 'fr-BE'
      | 'fr-CH'
      | 'fr-FR'
      | 'fy'
      | 'fy-NL'
      | 'hi'
      | 'hr'
      | 'it'
      | 'it-CH'
      | 'it-IT'
      | 'ja'
      | 'ko'
      | 'nl'
      | 'nl-BE'
      | 'nl-NL'
      | 'no'
      | 'no-NO'
      | 'pa'
      | 'pl'
      | 'pt'
      | 'pt-BR'
      | 'ru'
      | 'ru-RU'
      | 'sr'
      | 'sr-RS'
      | 'sv'
      | 'sv-SE'
      | 'te'
      | 'zh'
      | 'zh-CN'
      | 'zh-HK'
      | 'zh-SG'
      | 'zh-TW';
    /* display | print | printoper */
    'type'?: 'display' | 'print' | 'printoper';
    _text?: Element;
  };
  _disposition?: Element;
  /* More granular claim type */
  'type': CodeableConcept;
  total?: {
    /* Type of adjudication information */
    category: CodeableConcept;
    /* Financial total for the category */
    amount: Money;
  };
  /* Party responsible for the claim */
  requestor?: Reference<'Organization' | 'Practitioner' | 'PractitionerRole'>;
  _preAuthRef?: Element;
  /* Payment Details */
  payment?: {
    /* Payment adjustment for non-claim issues */
    adjustment?: Money;
    /* Payable amount after adjustment */
    amount: Money;
    /* Expected date of payment */
    date?: date;
    /* Partial or complete payment */
    'type': CodeableConcept;
    _date?: Element;
    /* Business identifier for the payment */
    identifier?: Identifier;
    /* Explanation for the adjustment */
    adjustmentReason?: CodeableConcept;
  };
  /* Funds reserved status */
  fundsReserve?: CodeableConcept;
  _status?: Element;
  _outcome?: Element;
  _created?: Element;
  /* Id of resource triggering adjudication */
  request?: Reference<'Claim'>;
  insurance?: {
    /* Insurance information */
    coverage: Reference<'Coverage'>;
    /* Insurance instance identifier */
    sequence: positiveInt;
    _focal?: Element;
    _businessArrangement?: Element;
    _sequence?: Element;
    /* Additional provider contract number */
    businessArrangement?: string;
    /* Coverage to be used for adjudication */
    focal: boolean;
    /* Adjudication results */
    claimResponse?: Reference<'ClaimResponse'>;
  };
  /* Party to be paid any benefits payable */
  payeeType?: CodeableConcept;
  communicationRequest?: Array<Reference<'CommunicationRequest'>>;
  /* Response creation date */
  created: dateTime;
  item?: {
    noteNumber?: positiveInt;
    _noteNumber?: Element;
    detail?: {
      subDetail?: {
        /* Claim sub-detail instance identifier */
        subDetailSequence: positiveInt;
        _noteNumber?: Element;
        _subDetailSequence?: Element;
        adjudication?: any;
        noteNumber?: positiveInt;
      };
      _noteNumber?: Element;
      adjudication: any;
      /* Claim detail instance identifier */
      detailSequence: positiveInt;
      noteNumber?: positiveInt;
      _detailSequence?: Element;
    };
    /* Claim item instance identifier */
    itemSequence: positiveInt;
    _itemSequence?: Element;
    adjudication: {
      _value?: Element;
      /* Monetary amount */
      amount?: Money;
      /* Explanation of adjudication outcome */
      reason?: CodeableConcept;
      /* Type of adjudication information */
      category: CodeableConcept;
      /* Non-monetary value */
      value?: decimal;
    };
  };
  /* Party responsible for reimbursement */
  insurer: Reference<'Organization'>;
  addItem?: {
    detail?: {
      /* Total item cost */
      net?: Money;
      /* Billing, service, product, or drug code */
      productOrService: CodeableConcept;
      /* Count of products or services */
      quantity?: Quantity;
      /* Fee, charge or cost per item */
      unitPrice?: Money;
      subDetail?: {
        /* Price scaling factor */
        factor?: decimal;
        /* Count of products or services */
        quantity?: Quantity;
        /* Total item cost */
        net?: Money;
        _noteNumber?: Element;
        modifier?: CodeableConcept;
        /* Billing, service, product, or drug code */
        productOrService: CodeableConcept;
        _factor?: Element;
        noteNumber?: positiveInt;
        /* Fee, charge or cost per item */
        unitPrice?: Money;
        adjudication: any;
      };
      noteNumber?: positiveInt;
      _factor?: Element;
      /* Price scaling factor */
      factor?: decimal;
      adjudication: any;
      _noteNumber?: Element;
      modifier?: CodeableConcept;
    };
    /* Place of service or where product was supplied */
    location?: {
      Reference?: Reference<'Location'>;
      Address?: Address;
      CodeableConcept?: CodeableConcept;
    };
    provider?: Array<Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>>;
    _detailSequence?: Element;
    /* Total item cost */
    net?: Money;
    subdetailSequence?: positiveInt;
    adjudication: any;
    _noteNumber?: Element;
    detailSequence?: positiveInt;
    itemSequence?: positiveInt;
    modifier?: CodeableConcept;
    /* Anatomical location */
    bodySite?: CodeableConcept;
    /* Fee, charge or cost per item */
    unitPrice?: Money;
    _factor?: Element;
    _subdetailSequence?: Element;
    programCode?: CodeableConcept;
    /* Count of products or services */
    quantity?: Quantity;
    /* Billing, service, product, or drug code */
    productOrService: CodeableConcept;
    subSite?: CodeableConcept;
    noteNumber?: positiveInt;
    _itemSequence?: Element;
    /* Date or dates of service or product delivery */
    serviced?: {
      Period?: Period;
      date?: date;
      _date?: Element;
    };
    /* Price scaling factor */
    factor?: decimal;
  };
  /* The recipient of the products and services */
  patient: Reference<'Patient'>;
  /* Preauthorization reference effective period */
  preAuthPeriod?: Period;
  /* Preauthorization reference */
  preAuthRef?: string;
  /* Printed reference or actual form */
  form?: Attachment;
  /* Disposition Message */
  disposition?: string;
  adjudication?: any;
  _use?: Element;
  /* More granular claim type */
  subType?: CodeableConcept;
  /* Printed form identifier */
  formCode?: CodeableConcept;
  identifier?: Identifier;
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  error?: {
    /* Error code detailing processing issues */
    code: CodeableConcept;
    /* Detail sequence number */
    detailSequence?: positiveInt;
    /* Item sequence number */
    itemSequence?: positiveInt;
    /* Subdetail sequence number */
    subDetailSequence?: positiveInt;
    _itemSequence?: Element;
    _detailSequence?: Element;
    _subDetailSequence?: Element;
  };
  /* queued | complete | error | partial */
  outcome: 'complete' | 'error' | 'partial' | 'queued';
}

/* Example of workflow instance. */
export interface ExampleScenario extends DomainResource, Resource<'ExampleScenario'> {
  _experimental?: Element;
  _name?: Element;
  _workflow?: Element;
  _version?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* Canonical identifier for this example scenario, represented as a URI (globally unique) */
  url?: uri;
  /* The purpose of the example, e.g. to illustrate a scenario */
  purpose?: markdown;
  _publisher?: Element;
  _date?: Element;
  _copyright?: Element;
  _status?: Element;
  _url?: Element;
  identifier?: Identifier;
  process?: {
    _title?: Element;
    /* A longer description of the group of operations */
    description?: markdown;
    /* Description of initial status before the process starts */
    preConditions?: markdown;
    _description?: Element;
    _preConditions?: Element;
    step?: {
      /* If there is a pause in the flow */
      pause?: boolean;
      /* Each interaction or action */
      operation?: {
        /* Who starts the transaction */
        initiator?: string;
        _receiverActive?: Element;
        _initiator?: Element;
        /* Each resource instance used by the responder */
        response?: any;
        /* The type of operation - CRUD */
        'type'?: string;
        /* Who receives the transaction */
        receiver?: string;
        _number?: Element;
        _type?: Element;
        _initiatorActive?: Element;
        /* The human-friendly name of the interaction */
        name?: string;
        _name?: Element;
        /* Whether the initiator is deactivated right after the transaction */
        initiatorActive?: boolean;
        /* Whether the receiver is deactivated right after the transaction */
        receiverActive?: boolean;
        _description?: Element;
        /* Each resource instance used by the initiator */
        request?: any;
        /* The sequential number of the interaction */
        number: string;
        /* A comment to be inserted in the diagram */
        description?: markdown;
        _receiver?: Element;
      };
      process?: any;
      _pause?: Element;
      alternative?: {
        /* A human-readable description of each option */
        description?: markdown;
        _description?: Element;
        step?: any;
        _title?: Element;
        /* Label for alternative */
        title: string;
      };
    };
    _postConditions?: Element;
    /* Description of final status after the process ends */
    postConditions?: markdown;
    /* The diagram title of the group of operations */
    title: string;
  };
  useContext?: UsageContext;
  jurisdiction?: CodeableConcept;
  actor?: {
    _name?: Element;
    _actorId?: Element;
    /* person | entity */
    'type': 'entity' | 'person';
    _description?: Element;
    /* The name of the actor as shown in the page */
    name?: string;
    /* ID or acronym of the actor */
    actorId: string;
    /* The description of the actor */
    description?: markdown;
    _type?: Element;
  };
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  instance?: {
    _resourceId?: Element;
    /* The type of the resource */
    resourceType:
      | 'Account'
      | 'ActivityDefinition'
      | 'AdverseEvent'
      | 'AllergyIntolerance'
      | 'Appointment'
      | 'AppointmentResponse'
      | 'AuditEvent'
      | 'Basic'
      | 'Binary'
      | 'BiologicallyDerivedProduct'
      | 'BodyStructure'
      | 'Bundle'
      | 'CapabilityStatement'
      | 'CarePlan'
      | 'CareTeam'
      | 'CatalogEntry'
      | 'ChargeItem'
      | 'ChargeItemDefinition'
      | 'Claim'
      | 'ClaimResponse'
      | 'ClinicalImpression'
      | 'CodeSystem'
      | 'Communication'
      | 'CommunicationRequest'
      | 'CompartmentDefinition'
      | 'Composition'
      | 'ConceptMap'
      | 'Condition'
      | 'Consent'
      | 'Contract'
      | 'Coverage'
      | 'CoverageEligibilityRequest'
      | 'CoverageEligibilityResponse'
      | 'DetectedIssue'
      | 'Device'
      | 'DeviceDefinition'
      | 'DeviceMetric'
      | 'DeviceRequest'
      | 'DeviceUseStatement'
      | 'DiagnosticReport'
      | 'DocumentManifest'
      | 'DocumentReference'
      | 'DomainResource'
      | 'EffectEvidenceSynthesis'
      | 'Encounter'
      | 'Endpoint'
      | 'EnrollmentRequest'
      | 'EnrollmentResponse'
      | 'EpisodeOfCare'
      | 'EventDefinition'
      | 'Evidence'
      | 'EvidenceVariable'
      | 'ExampleScenario'
      | 'ExplanationOfBenefit'
      | 'FamilyMemberHistory'
      | 'Flag'
      | 'Goal'
      | 'GraphDefinition'
      | 'Group'
      | 'GuidanceResponse'
      | 'HealthcareService'
      | 'ImagingStudy'
      | 'Immunization'
      | 'ImmunizationEvaluation'
      | 'ImmunizationRecommendation'
      | 'ImplementationGuide'
      | 'InsurancePlan'
      | 'Invoice'
      | 'Library'
      | 'Linkage'
      | 'List'
      | 'Location'
      | 'Measure'
      | 'MeasureReport'
      | 'Media'
      | 'Medication'
      | 'MedicationAdministration'
      | 'MedicationDispense'
      | 'MedicationKnowledge'
      | 'MedicationRequest'
      | 'MedicationStatement'
      | 'MedicinalProduct'
      | 'MedicinalProductAuthorization'
      | 'MedicinalProductContraindication'
      | 'MedicinalProductIndication'
      | 'MedicinalProductIngredient'
      | 'MedicinalProductInteraction'
      | 'MedicinalProductManufactured'
      | 'MedicinalProductPackaged'
      | 'MedicinalProductPharmaceutical'
      | 'MedicinalProductUndesirableEffect'
      | 'MessageDefinition'
      | 'MessageHeader'
      | 'MolecularSequence'
      | 'NamingSystem'
      | 'NutritionOrder'
      | 'Observation'
      | 'ObservationDefinition'
      | 'OperationDefinition'
      | 'OperationOutcome';
    containedInstance?: {
      _versionId?: Element;
      _resourceId?: Element;
      /* A specific version of a resource contained in the instance */
      versionId?: string;
      /* Each resource contained in the instance */
      resourceId: string;
    };
    _name?: Element;
    /* A short name for the resource instance */
    name?: string;
    /* The id of the resource for referencing */
    resourceId: string;
    /* Human-friendly description of the resource instance */
    description?: markdown;
    _resourceType?: Element;
    _description?: Element;
    version?: {
      _description?: Element;
      _versionId?: Element;
      /* The identifier of a specific version of a resource */
      versionId: string;
      /* The description of the resource version */
      description: markdown;
    };
  };
  /* Name for this example scenario (computer friendly) */
  name?: string;
  /* Business version of the example scenario */
  version?: string;
  workflow?: canonical;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Date last changed */
  date?: dateTime;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _purpose?: Element;
  contact?: ContactDetail;
}

export interface AccountProduct extends Resource<'AccountProduct'> {
  product: Reference<'Product'>;
  systemAccount: Reference<'SystemAccount'>;
}

/* A record of a medication that is being consumed by a patient.   A MedicationStatement may indicate that the patient may be taking the medication now or has taken the medication in the past or will be taking the medication in the future.  The source of this information can be the patient, significant other (such as a family member or spouse), or a clinician.  A common scenario where this information is captured is during the history taking process during a patient visit or stay.   The medication information may come from sources such as the patient's memory, from a prescription bottle,  or from a list of medications the patient, clinician or other party maintains.

The primary difference between a medication statement and a medication administration is that the medication administration has complete administration information and is based on actual administration information from the person who administered the medication.  A medication statement is often, if not always, less specific.  There is no required date/time when the medication was administered, in fact we only know that a source has reported the patient is taking this medication, where details such as time, quantity, or rate or even medication product may be incomplete or missing or less precise.  As stated earlier, the medication statement information may come from the patient's memory, from a prescription bottle or from a list of medications the patient, clinician or other party maintains.  Medication administration is more formal and is not missing detailed information. */
export interface MedicationStatement extends DomainResource, Resource<'MedicationStatement'> {
  basedOn?: Array<Reference<'ServiceRequest' | 'MedicationRequest' | 'CarePlan'>>;
  _status?: Element;
  /* What medication was taken */
  medication?: {
    Reference?: Reference<'Medication'>;
    CodeableConcept?: CodeableConcept;
  };
  /* Who is/was taking  the medication */
  subject: Reference<'Group' | 'Patient'>;
  reasonReference?: Array<Reference<'Observation' | 'Condition' | 'DiagnosticReport'>>;
  derivedFrom?: Array<Reference<'Reference'>>;
  /* The date/time or interval when the medication is/was/will be taken */
  effective?: {
    _dateTime?: Element;
    dateTime?: dateTime;
    Period?: Period;
  };
  identifier?: Identifier;
  partOf?: Array<
    Reference<'MedicationAdministration' | 'Observation' | 'Procedure' | 'MedicationDispense' | 'MedicationStatement'>
  >;
  /* Encounter / Episode associated with MedicationStatement */
  context?: Reference<'EpisodeOfCare' | 'Encounter'>;
  note?: Annotation;
  /* When the statement was asserted? */
  dateAsserted?: dateTime;
  /* Type of medication usage */
  category?: 'community' | 'inpatient' | 'outpatient' | 'patientspecified';
  _dateAsserted?: Element;
  dosage?: Dosage;
  reasonCode?: CodeableConcept;
  statusReason?: CodeableConcept;
  /* Person or organization that provided the information about the taking of this medication */
  informationSource?: Reference<'Patient' | 'Organization' | 'Practitioner' | 'PractitionerRole' | 'RelatedPerson'>;
  /* active | completed | entered-in-error | intended | stopped | on-hold | unknown | not-taken */
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'not-taken' | 'on-hold' | 'stopped' | 'unknown';
}

/* A pharmaceutical product described in terms of its composition and dose form. */
export interface MedicinalProductPharmaceutical extends DomainResource, Resource<'MedicinalProductPharmaceutical'> {
  routeOfAdministration: {
    /* The maximum dose per treatment period that can be administered as per the protocol referenced in the clinical trial authorisation */
    maxDosePerTreatmentPeriod?: Ratio;
    /* The first dose (dose quantity) administered in humans can be specified, for a product under investigation, using a numerical value and its unit of measurement */
    firstDose?: Quantity;
    /* The maximum dose per day (maximum dose quantity to be administered in any one 24-h period) that can be administered as per the protocol referenced in the clinical trial authorisation */
    maxDosePerDay?: Quantity;
    /* The maximum single dose that can be administered as per the protocol of a clinical trial can be specified using a numerical value and its unit of measurement */
    maxSingleDose?: Quantity;
    /* The maximum treatment period during which an Investigational Medicinal Product can be administered as per the protocol referenced in the clinical trial authorisation */
    maxTreatmentPeriod?: Duration;
    /* Coded expression for the route */
    code: CodeableConcept;
    targetSpecies?: {
      /* Coded expression for the species */
      code: CodeableConcept;
      withdrawalPeriod?: {
        /* Coded expression for the type of tissue for which the withdrawal period applues, e.g. meat, milk */
        tissue: CodeableConcept;
        /* Extra information about the withdrawal period */
        supportingInformation?: string;
        /* A value for the time */
        value: Quantity;
        _supportingInformation?: Element;
      };
    };
  };
  ingredient?: Array<Reference<'MedicinalProductIngredient'>>;
  /* Todo */
  unitOfPresentation?: CodeableConcept;
  device?: Array<Reference<'DeviceDefinition'>>;
  identifier?: Identifier;
  characteristics?: {
    /* A coded characteristic */
    code: CodeableConcept;
    /* The status of characteristic e.g. assigned or pending */
    status?: CodeableConcept;
  };
  /* The administrable dose form, after necessary reconstitution */
  administrableDoseForm: CodeableConcept;
}

/* A resource that represents the data of a single raw artifact as digital content accessible in its native format.  A Binary resource can contain any content, whether text, image, pdf, zip archive, etc. */
export interface Binary extends Resource<'Binary'> {
  /* The actual content */
  data?: base64Binary;
  /* MimeType of the binary content */
  contentType: 'application/hl7-cda+xml';
  /* Identifies another resource to use as proxy when enforcing access control */
  securityContext?: Reference<'Reference'>;
  _contentType?: Element;
  _data?: Element;
}

/* Base StructureDefinition for Coding Type: A reference to a code defined by a terminology system. */
export interface Coding<T = code> extends Element {
  _display?: Element;
  /* Symbol in syntax defined by the system */
  code?: code;
  /* Representation defined by the system */
  display?: string;
  _code?: Element;
  /* Identity of the terminology system */
  system?: uri;
  /* If this coding was chosen directly by the user */
  userSelected?: boolean;
  _version?: Element;
  _system?: Element;
  _userSelected?: Element;
  /* Version of the system - if relevant */
  version?: string;
}

/* Consumers of the value set and the implementations, projects or standards that the author has utilized the value set in. */
export interface codesystemUsage {
  /* Implementation/project/standard that uses value set */
  use: string;
  /* A consumer of or client for the value set */
  user: string;
}

/* Base StructureDefinition for Distance Type: A length - a value with a unit that is a physical distance. */
export type Distance = Quantity;
/* Consumers of the value set and the implementations, projects or standards that the author has utilized the value set in. */
export interface valuesetUsage {
  /* A consumer of or client for the value set */
  user: string;
  /* Implementation/project/standard that uses value set */
  use: string;
}

/* Days of a possibly repeating cycle on which the action is to be performed. The cycle is defined by the first action with a timing element that is a parent of the daysOfCycle. */
export interface timingDaysOfCycle {
  day: integer;
}

export interface MessageTemplate extends Resource<'MessageTemplate'> {
  'type'?: 'general' | 'confirm' | 'reschedule' | 'cancel' | 'opt-out' | 'reply-policy' | 'broadcast';
  campaignType?: 'appointment-reminder' | 'appointment-notification' | 'appointment-noshow' | 'recall' | 'broadcast';
  criteria?: {
    [key: string]: any;
  };
  content?: {
    voice?: {
      verified: boolean;
      language: 'en' | 'es' | 'de' | 'it' | 'hi';
      message: string;
      'type'?: 'voicemail' | 'default';
    };
    email?: {
      subject?: string;
      language: 'en' | 'es' | 'de' | 'it' | 'hi';
      verified: boolean;
      message: string;
    };
    sms?: {
      message: string;
      language: 'en' | 'es' | 'de' | 'it' | 'hi';
      verified: boolean;
    };
  };
  replyOptions?: {
    operation: 'confirm' | 'reschedule' | 'cancel' | 'custom' | 'timeout' | 'opt-out';
    label?: string;
    command?: string;
  };
  name: string;
  systemAccount: Reference<'SystemAccount'>;
  editedBy?: Reference<'User'>;
  system?: boolean;
  version?: string;
  organization?: Reference<'Organization'>;
}

/* Base StructureDefinition for Dosage Type: Indicates how the medication is/was taken or should be taken by the patient. */
export interface Dosage extends BackboneElement {
  /* Upper limit on medication per administration */
  maxDosePerAdministration?: Quantity;
  additionalInstruction?: CodeableConcept;
  _patientInstruction?: Element;
  _text?: Element;
  doseAndRate?: {
    /* Amount of medication per dose */
    dose?: {
      Quantity?: Quantity;
      Range?: Range;
    };
    /* The kind of dose or rate specified */
    'type'?: CodeableConcept;
    /* Amount of medication per unit of time */
    rate?: {
      Quantity?: Quantity;
      Ratio?: Ratio;
      Range?: Range;
    };
  };
  /* How drug should enter body */
  route?: CodeableConcept;
  /* Patient or consumer oriented instructions */
  patientInstruction?: string;
  /* When medication should be administered */
  timing?: Timing;
  /* The order of the dosage instructions */
  sequence?: integer;
  /* Upper limit on medication per unit of time */
  maxDosePerPeriod?: Ratio;
  /* Technique for administering medication */
  method?: CodeableConcept;
  /* Free text dosage instructions e.g. SIG */
  text?: string;
  _sequence?: Element;
  /* Take "as needed" (for x) */
  asNeeded?: {
    _boolean?: Element;
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
  };
  /* Body site to administer to */
  site?: CodeableConcept;
  /* Upper limit on medication per lifetime of the patient */
  maxDosePerLifetime?: Quantity;
}

export interface Permission extends Resource<'Permission'> {
  active: boolean;
  description?: string;
  feature: Reference<'Feature'>;
  name: string;
}

export type RPCstatsByDate = {
  method: 'relatient.workshift/stats-by-date';
  params: {
    [key: string]: any;
  };
};
/* Contain email layout specific settings */
export interface EmailSetting extends Resource<'EmailSetting'> {
  name: string;
  linkUrl: string;
  key: string;
  logo?: string;
  headerColor: string;
  fileName: string;
  usedBy?: Reference<'Location' | 'Organization'>;
  systemAccount: Reference<'SystemAccount'>;
}

export interface ValueSet extends DomainResource, Resource<'ValueSet'> {
  _experimental?: Element;
  identifier?: Identifier;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _immutable?: Element;
  _copyright?: Element;
  _publisher?: Element;
  /* Content logical definition of the value set (CLD) */
  compose?: {
    _inactive?: Element;
    /* Whether inactive codes are in the value set */
    inactive?: boolean;
    include: {
      _system?: Element;
      _version?: Element;
      valueSet?: canonical;
      _valueSet?: Element;
      /* Specific version of the code system referred to */
      version?: string;
      filter?: {
        /* A property/filter defined by the code system */
        property: code;
        _value?: Element;
        _property?: Element;
        /* Code from the system, or regex criteria, or boolean value for exists */
        value: string;
        /* = | is-a | descendent-of | is-not-a | regex | in | not-in | generalizes | exists */
        op: '=' | 'descendent-of' | 'exists' | 'generalizes' | 'in' | 'is-a' | 'is-not-a' | 'not-in' | 'regex';
        _op?: Element;
      };
      /* The system the codes come from */
      system?: uri;
      concept?: {
        /* Code or expression from system */
        code: code;
        _display?: Element;
        _code?: Element;
        designation?: {
          /* Types of uses of designations */
          use?: Coding;
          _value?: Element;
          /* Human language of the designation */
          language?:
            | 'ar'
            | 'bn'
            | 'cs'
            | 'da'
            | 'de'
            | 'de-AT'
            | 'de-CH'
            | 'de-DE'
            | 'el'
            | 'en'
            | 'en-AU'
            | 'en-CA'
            | 'en-GB'
            | 'en-IN'
            | 'en-NZ'
            | 'en-SG'
            | 'en-US'
            | 'es'
            | 'es-AR'
            | 'es-ES'
            | 'es-UY'
            | 'fi'
            | 'fr'
            | 'fr-BE'
            | 'fr-CH'
            | 'fr-FR'
            | 'fy'
            | 'fy-NL'
            | 'hi'
            | 'hr'
            | 'it'
            | 'it-CH'
            | 'it-IT'
            | 'ja'
            | 'ko'
            | 'nl'
            | 'nl-BE'
            | 'nl-NL'
            | 'no'
            | 'no-NO'
            | 'pa'
            | 'pl'
            | 'pt'
            | 'pt-BR'
            | 'ru'
            | 'ru-RU'
            | 'sr'
            | 'sr-RS'
            | 'sv'
            | 'sv-SE'
            | 'te'
            | 'zh'
            | 'zh-CN'
            | 'zh-HK'
            | 'zh-SG'
            | 'zh-TW';
          _language?: Element;
          /* The text value for this designation */
          value: string;
        };
        /* Text to display for this code for this value set in this valueset */
        display?: string;
      };
    };
    _lockedDate?: Element;
    exclude?: any;
    /* Fixed date for references with no specified version (transitive) */
    lockedDate?: date;
  };
  _title?: Element;
  _url?: Element;
  /* Natural language description of the value set */
  description?: markdown;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  _description?: Element;
  /* Name for this value set (human friendly) */
  title?: string;
  /* Canonical identifier for this value set, represented as a URI (globally unique) */
  url?: uri;
  /* Used when the value set is "expanded" */
  expansion?: {
    _total?: Element;
    contains?: {
      _abstract?: Element;
      _inactive?: Element;
      _version?: Element;
      _code?: Element;
      /* User display for the concept */
      display?: string;
      _system?: Element;
      contains?: any;
      designation?: any;
      /* System value for the code */
      system?: uri;
      /* If concept is inactive in the code system */
      inactive?: boolean;
      /* Version in which this code/display is defined */
      version?: string;
      /* If user cannot select this entry */
      abstract?: boolean;
      _display?: Element;
      /* Code - if blank, this is not a selectable code */
      code?: code;
    };
    /* Total number of codes in the expansion */
    total?: integer;
    /* Offset at which this resource starts */
    offset?: integer;
    _offset?: Element;
    /* Time ValueSet expansion happened */
    timestamp: dateTime;
    _timestamp?: Element;
    _identifier?: Element;
    parameter?: {
      /* Name as assigned by the client or server */
      name: string;
      /* Value of the named parameter */
      value?: {
        _code?: Element;
        boolean?: boolean;
        code?: code;
        _uri?: Element;
        _dateTime?: Element;
        _string?: Element;
        _integer?: Element;
        _decimal?: Element;
        integer?: integer;
        dateTime?: dateTime;
        decimal?: decimal;
        string?: string;
        uri?: uri;
        _boolean?: Element;
      };
      _name?: Element;
    };
    /* Identifies the value set expansion (business identifier) */
    identifier?: uri;
  };
  /* Indicates whether or not any change to the content logical definition may occur */
  immutable?: boolean;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  /* Name for this value set (computer friendly) */
  name?: string;
  _date?: Element;
  contact?: ContactDetail;
  /* Date last changed */
  date?: dateTime;
  _name?: Element;
  /* Business version of the value set */
  version?: string;
  _version?: Element;
  jurisdiction?: CodeableConcept;
  /* Why this value set is defined */
  purpose?: markdown;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  useContext?: UsageContext;
  _purpose?: Element;
  _status?: Element;
}

/* Indication for the Medicinal Product. */
export interface MedicinalProductIndication extends DomainResource, Resource<'MedicinalProductIndication'> {
  undesirableEffect?: Array<Reference<'MedicinalProductUndesirableEffect'>>;
  otherTherapy?: {
    /* Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication */
    medication?: {
      Reference?: Reference<'Substance' | 'SubstanceSpecification' | 'Medication' | 'MedicinalProduct'>;
      CodeableConcept?: CodeableConcept;
    };
    /* The type of relationship between the medicinal product indication or contraindication and another therapy */
    therapyRelationshipType: CodeableConcept;
  };
  /* The status of the disease or symptom for which the indication applies */
  diseaseStatus?: CodeableConcept;
  subject?: Array<Reference<'MedicinalProduct' | 'Medication'>>;
  /* The disease, symptom or procedure that is the indication for treatment */
  diseaseSymptomProcedure?: CodeableConcept;
  /* The intended effect, aim or strategy to be achieved by the indication */
  intendedEffect?: CodeableConcept;
  /* Timing or duration information as part of the indication */
  duration?: Quantity;
  comorbidity?: CodeableConcept;
  population?: Population;
}

export interface baseFilter {
  key?: string;
  lastValue?: string;
  subKey?: string;
  value?: Array<string>;
  operator?: 'eq' | 'ne' | 'gte' | 'gt' | 'lte' | 'lt' | 'between';
  'type'?: 'date';
}

/* Basic is used for handling concepts not yet defined in FHIR, narrative-only resources that don't map to an existing resource, and custom resources not appropriate for inclusion in the FHIR specification. */
export interface Basic extends DomainResource, Resource<'Basic'> {
  /* Who created */
  author?: Reference<'PractitionerRole' | 'Patient' | 'RelatedPerson' | 'Practitioner' | 'Organization'>;
  _created?: Element;
  identifier?: Identifier;
  /* Kind of Resource */
  code: CodeableConcept;
  /* Identifies the focus of this resource */
  subject?: Reference<'Reference'>;
  /* When created */
  created?: date;
}

export type RPCreadRequest = {
  method: 'relatient.scheduling/read-request';
  params: {
    key: string;
  };
};
/* The EffectEvidenceSynthesis resource describes the difference in an outcome between exposures states in a population where the effect estimate is derived from a combination of research studies. */
export interface EffectEvidenceSynthesis extends DomainResource, Resource<'EffectEvidenceSynthesis'> {
  endorser?: ContactDetail;
  /* When the effect evidence synthesis was approved by publisher */
  approvalDate?: date;
  /* Business version of the effect evidence synthesis */
  version?: string;
  identifier?: Identifier;
  _date?: Element;
  _url?: Element;
  /* Type of synthesis */
  synthesisType?: CodeableConcept;
  author?: ContactDetail;
  reviewer?: ContactDetail;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _version?: Element;
  /* Canonical identifier for this effect evidence synthesis, represented as a URI (globally unique) */
  url?: uri;
  certainty?: {
    certaintySubcomponent?: {
      rating?: CodeableConcept;
      /* Type of subcomponent of certainty rating */
      'type'?: CodeableConcept;
      note?: Annotation;
    };
    note?: Annotation;
    rating?: CodeableConcept;
  };
  /* What outcome? */
  outcome: Reference<'EvidenceVariable'>;
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  useContext?: UsageContext;
  /* Name for this effect evidence synthesis (computer friendly) */
  name?: string;
  /* Date last changed */
  date?: dateTime;
  _status?: Element;
  _title?: Element;
  _description?: Element;
  note?: Annotation;
  /* What population? */
  population: Reference<'EvidenceVariable'>;
  /* What sample size was involved? */
  sampleSize?: {
    /* How many participants? */
    numberOfParticipants?: integer;
    /* Description of sample size */
    description?: string;
    /* How many studies? */
    numberOfStudies?: integer;
    _description?: Element;
    _numberOfParticipants?: Element;
    _numberOfStudies?: Element;
  };
  /* Type of study */
  studyType?: CodeableConcept;
  /* Name for this effect evidence synthesis (human friendly) */
  title?: string;
  _copyright?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  contact?: ContactDetail;
  editor?: ContactDetail;
  _lastReviewDate?: Element;
  effectEstimate?: {
    _value?: Element;
    /* Variant exposure states */
    variantState?: CodeableConcept;
    /* Type of efffect estimate */
    'type'?: CodeableConcept;
    /* Point estimate */
    value?: decimal;
    /* What unit is the outcome described in? */
    unitOfMeasure?:
      | 'N'
      | 'h'
      | 'H'
      | '{HaTiter}'
      | '{HA_titer}'
      | '%{Hb}'
      | '[hd_i]'
      | '%{Hemoglobin}'
      | '%{HemoglobinA1C}'
      | '%{HemoglobinSaturation}'
      | '%{hemolysis}'
      | '%{Hemolysis}'
      | 'hL'
      | "[hnsf'U]"
      | '[HP]'
      | '[hp_C]'
      | '/[HPF]'
      | '{#}/[HPF]'
      | '[hp_M]'
      | '[hp_Q]'
      | '[hp_X]'
      | '%{HumanResponse}'
      | 'Hz'
      | '{IfaIndex}'
      | '{IFA_index}'
      | '{IfaTiter}'
      | '{IFA_titer}'
      | "{IgAAntiphosphatidyleserine'U}"
      | "{IgAPhospholipid'U}"
      | "{IgGAntiphosphatidyleserine'U}"
      | '{IgGIndex}'
      | "{IgMAntiphosphatidyleserine'U}"
      | '{IgMIndex}'
      | "{ImmuneComplex'U}"
      | '{ImmuneStatusRatio}'
      | '{Immunity}'
      | '[in_br]'
      | '%{index}'
      | '{index}'
      | '%{Index}'
      | '{index_val}'
      | '{Index_val}'
      | '{IndexValue}'
      | '{InhaledTobaccoUseAmountYears}'
      | 'g/L'
      | '{InhaledTobaccoUsePacks}/d'
      | '%{inhibition}'
      | '%{Inhibition}'
      | '[in_i]'
      | "[in_i'H2O]"
      | "[in_i'Hg]"
      | '{INR}'
      | "{INR'unit}"
      | '[in_us]'
      | '{ISR}'
      | '/[iU]'
      | '[iU]'
      | '/[IU]'
      | '[IU]'
      | '[IU]/10*9{RBCs}'
      | '[HPF]'
      | '[IU]/(24.h)'
      | '[IU]/(2.h)'
      | '[IU]/d'
      | '[iU]/dL'
      | '[IU]/dL'
      | '[iU]/g'
      | '[IU]/g{Hb}'
      | '[iU]/g{Hgb}'
      | '[IU]/h'
      | '[iU]/kg'
      | '[IU]/kg'
      | '[IU]/kg/d'
      | '[iU]/L'
      | '[IU]/L'
      | '[IU]/L{37Cel}'
      | '[IU]/mg{creat}'
      | '[IU]/min'
      | '[iU]/mL'
      | '[IU]/mL'
      | "{JDF'U}"
      | "{JDF'U}/L"
      | 'J/L'
      | "{JuvenileDiabetesFound'U}"
      | '[k]'
      | 'K'
      | 'kat'
      | 'kat/kg'
      | 'kat/L'
      | "[ka'U]"
      | 'kBq'
      | 'kcal/(8.h)'
      | 'kcal/d'
      | 'kcal/h'
      | 'kcal/kg/(24.h)'
      | 'kcal/[oz_av]'
      | "{KCT'U}"
      | '/kg'
      | 'kg'
      | "/kg{body'wt}";
    precisionEstimate?: {
      _level?: Element;
      /* Type of precision estimate */
      'type'?: CodeableConcept;
      _to?: Element;
      _from?: Element;
      /* Lower bound */
      from?: decimal;
      /* Upper bound */
      to?: decimal;
      /* Level of confidence interval */
      level?: decimal;
    };
    /* Description of effect estimate */
    description?: string;
    _description?: Element;
  };
  _name?: Element;
  /* What exposure? */
  exposure: Reference<'EvidenceVariable'>;
  /* When the effect evidence synthesis is expected to be used */
  effectivePeriod?: Period;
  jurisdiction?: CodeableConcept;
  relatedArtifact?: RelatedArtifact;
  resultsByExposure?: {
    _description?: Element;
    /* exposure | exposure-alternative */
    exposureState?: 'exposure' | 'exposure-alternative';
    _exposureState?: Element;
    /* Risk evidence synthesis */
    riskEvidenceSynthesis: Reference<'RiskEvidenceSynthesis'>;
    /* Description of results by exposure */
    description?: string;
    /* Variant exposure states */
    variantState?: CodeableConcept;
  };
  topic?: CodeableConcept;
  _publisher?: Element;
  /* When the effect evidence synthesis was last reviewed */
  lastReviewDate?: date;
  _approvalDate?: Element;
  /* Natural language description of the effect evidence synthesis */
  description?: markdown;
  /* What comparison exposure? */
  exposureAlternative: Reference<'EvidenceVariable'>;
}

/* A record of a device being used by a patient where the record is the result of a report from the patient or another clinician. */
export interface DeviceUseStatement extends DomainResource, Resource<'DeviceUseStatement'> {
  /* Who made the statement */
  source?: Reference<'RelatedPerson' | 'Practitioner' | 'Patient' | 'PractitionerRole'>;
  _status?: Element;
  /* When statement was recorded */
  recordedOn?: dateTime;
  /* active | completed | entered-in-error + */
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'on-hold' | 'stopped';
  /* How often  the device was used */
  timing?: {
    Timing?: Timing;
    Period?: Period;
    dateTime?: dateTime;
    _dateTime?: Element;
  };
  /* Target body site */
  bodySite?: CodeableConcept;
  /* Patient using device */
  subject: Reference<'Group' | 'Patient'>;
  note?: Annotation;
  reasonReference?: Array<Reference<'Media' | 'Observation' | 'Condition' | 'DocumentReference' | 'DiagnosticReport'>>;
  _recordedOn?: Element;
  derivedFrom?: Array<
    Reference<'DocumentReference' | 'ServiceRequest' | 'Observation' | 'QuestionnaireResponse' | 'Procedure' | 'Claim'>
  >;
  /* Reference to device used */
  device: Reference<'Device'>;
  identifier?: Identifier;
  basedOn?: Array<Reference<'ServiceRequest'>>;
  reasonCode?: CodeableConcept;
}

/* A slot of time on a schedule that may be available for booking appointments. */
export interface Slot extends DomainResource, Resource<'Slot'> {
  /* The schedule resource that this slot defines an interval of status information */
  schedule: Reference<'Schedule'>;
  serviceCategory?: CodeableConcept;
  /* The style of appointment or patient that may be booked in the slot (not service type) */
  appointmentType?: 'EMERGENCY' | 'FOLLOWUP' | 'ROUTINE' | 'WALKIN' | 'CHECKUP';
  /* Date/Time that the slot is to begin */
  start: instant;
  /* busy | free | busy-unavailable | busy-tentative | entered-in-error */
  status: 'busy' | 'busy-tentative' | 'busy-unavailable' | 'entered-in-error' | 'free';
  _comment?: Element;
  identifier?: Identifier;
  /* This slot has already been overbooked, appointments are unlikely to be accepted for this time */
  overbooked?: boolean;
  _overbooked?: Element;
  _start?: Element;
  /* Comments on the slot to describe any extended information. Such as custom constraints on the slot */
  comment?: string;
  _end?: Element;
  serviceType?: CodeableConcept;
  specialty?: Array<CodeableConcept>;
  /* Date/Time that the slot is to conclude */
  end: instant;
  _status?: Element;
}

/* Describes validation requirements, source(s), status and dates for one or more elements. */
export interface VerificationResult extends DomainResource, Resource<'VerificationResult'> {
  /* The date when target is next validated, if appropriate */
  nextScheduled?: date;
  primarySource?: {
    communicationMethod?: CodeableConcept;
    _validationDate?: Element;
    pushTypeAvailable?: Array<CodeableConcept>;
    /* Reference to the primary source */
    who?: Reference<'Organization' | 'PractitionerRole' | 'Practitioner'>;
    'type'?: CodeableConcept;
    /* yes | no | undetermined */
    canPushUpdates?: 'no' | 'undetermined' | 'yes';
    /* When the target was validated against the primary source */
    validationDate?: dateTime;
    /* successful | failed | unknown */
    validationStatus?: 'failed' | 'successful' | 'unknown';
  };
  _status?: Element;
  target?: Array<Reference<'Reference'>>;
  /* none | initial | periodic */
  need?: 'initial' | 'none' | 'periodic';
  /* Frequency of revalidation */
  frequency?: Timing;
  /* fatal | warn | rec-only | none */
  failureAction?: 'fatal' | 'none' | 'rec-only' | 'warn';
  _lastPerformed?: Element;
  /* The date/time validation was last completed (including failed validations) */
  lastPerformed?: dateTime;
  targetLocation?: string;
  /* When the validation status was updated */
  statusDate?: dateTime;
  /* nothing | primary | multiple */
  validationType?: 'multiple' | 'nothing' | 'primary';
  _statusDate?: Element;
  _nextScheduled?: Element;
  validator?: {
    /* Validator signature */
    attestationSignature?: Signature;
    _identityCertificate?: Element;
    /* A digital identity certificate associated with the validator */
    identityCertificate?: string;
    /* Reference to the organization validating information */
    organization: Reference<'Organization'>;
  };
  validationProcess?: CodeableConcept;
  /* attested | validated | in-process | req-revalid | val-fail | reval-fail */
  status: 'attested' | 'in-process' | 'req-revalid' | 'reval-fail' | 'val-fail' | 'validated';
  _targetLocation?: Element;
  /* Information about the entity attesting to information */
  attestation?: {
    _proxyIdentityCertificate?: Element;
    /* Attester signature */
    sourceSignature?: Signature;
    /* The individual or organization attesting to information */
    who?: Reference<'Practitioner' | 'Organization' | 'PractitionerRole'>;
    _sourceIdentityCertificate?: Element;
    /* The date the information was attested to */
    date?: date;
    /* The method by which attested information was submitted/retrieved */
    communicationMethod?: CodeableConcept;
    _date?: Element;
    /* A digital identity certificate associated with the attestation source */
    sourceIdentityCertificate?: string;
    /* When the who is asserting on behalf of another (organization or individual) */
    onBehalfOf?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
    /* A digital identity certificate associated with the proxy entity submitting attested information on behalf of the attestation source */
    proxyIdentityCertificate?: string;
    /* Proxy signature */
    proxySignature?: Signature;
  };
}

/* The EvidenceVariable resource describes a "PICO" element that knowledge (evidence, assertion, recommendation) is about. */
export interface EvidenceVariable extends DomainResource, Resource<'EvidenceVariable'> {
  /* Use and/or publishing restrictions */
  copyright?: markdown;
  jurisdiction?: CodeableConcept;
  /* Name for this evidence variable (computer friendly) */
  name?: string;
  note?: Annotation;
  /* Name for this evidence variable (human friendly) */
  title?: string;
  _subtitle?: Element;
  _shortTitle?: Element;
  /* Title for use in informal contexts */
  shortTitle?: string;
  _publisher?: Element;
  _description?: Element;
  _url?: Element;
  _status?: Element;
  /* When the evidence variable was approved by publisher */
  approvalDate?: date;
  /* Date last changed */
  date?: dateTime;
  /* When the evidence variable was last reviewed */
  lastReviewDate?: date;
  endorser?: ContactDetail;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  topic?: CodeableConcept;
  /* dichotomous | continuous | descriptive */
  'type'?: 'continuous' | 'descriptive' | 'dichotomous';
  useContext?: UsageContext;
  _version?: Element;
  _date?: Element;
  _approvalDate?: Element;
  _title?: Element;
  author?: ContactDetail;
  characteristic: {
    /* What time period do participants cover */
    participantEffective?: {
      dateTime?: dateTime;
      Duration?: Duration;
      _dateTime?: Element;
      Period?: Period;
      Timing?: Timing;
    };
    usageContext?: UsageContext;
    /* What code or expression defines members? */
    definition?: {
      Reference?: Reference<'Group'>;
      CodeableConcept?: CodeableConcept;
      DataRequirement?: DataRequirement;
      Expression?: Expression;
      _canonical?: Element;
      TriggerDefinition?: TriggerDefinition;
      canonical?: canonical;
    };
    /* Natural language description of the characteristic */
    description?: string;
    _exclude?: Element;
    _groupMeasure?: Element;
    /* mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median */
    groupMeasure?: 'mean' | 'mean-of-mean' | 'mean-of-median' | 'median' | 'median-of-mean' | 'median-of-median';
    /* Observation time from study start */
    timeFromStart?: Duration;
    /* Whether the characteristic includes or excludes members */
    exclude?: boolean;
    _description?: Element;
  };
  _lastReviewDate?: Element;
  contact?: ContactDetail;
  relatedArtifact?: RelatedArtifact;
  reviewer?: ContactDetail;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  _type?: Element;
  _name?: Element;
  _copyright?: Element;
  editor?: ContactDetail;
  /* When the evidence variable is expected to be used */
  effectivePeriod?: Period;
  identifier?: Identifier;
  /* Subordinate title of the EvidenceVariable */
  subtitle?: string;
  /* Natural language description of the evidence variable */
  description?: markdown;
  /* Canonical identifier for this evidence variable, represented as a URI (globally unique) */
  url?: uri;
  /* Business version of the evidence variable */
  version?: string;
}

/* The measure criteria that resulted in the resource being included in a particular evaluatedResources bundle. */
export interface cqfMeasureInfo {
  /* The group identifier */
  groupId?: string;
  /* The population identifier */
  populationId?: string;
  /* The measure being calculated */
  measure?: canonical;
}

/* A record of a request for service such as diagnostic investigations, treatments, or operations to be performed. */
export interface ServiceRequest extends DomainResource, Resource<'ServiceRequest'> {
  specimen?: Array<Reference<'Specimen'>>;
  /* Performer role */
  performerType?: CodeableConcept;
  orderDetail?: CodeableConcept;
  replaces?: Array<Reference<'ServiceRequest'>>;
  _instantiatesCanonical?: Element;
  /* When service should occur */
  occurrence?: {
    Period?: Period;
    _dateTime?: Element;
    dateTime?: dateTime;
    Timing?: Timing;
  };
  instantiatesCanonical?: canonical;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  note?: Annotation;
  relevantHistory?: Array<Reference<'Provenance'>>;
  _priority?: Element;
  _doNotPerform?: Element;
  supportingInfo?: Array<Reference<'Reference'>>;
  /* draft | active | on-hold | revoked | completed | entered-in-error | unknown */
  status: 'active' | 'completed' | 'draft' | 'entered-in-error' | 'on-hold' | 'revoked' | 'unknown';
  /* What is being requested/ordered */
  code?: CodeableConcept;
  locationCode?: CodeableConcept;
  _instantiatesUri?: Element;
  /* Composite Request ID */
  requisition?: Identifier;
  _patientInstruction?: Element;
  identifier?: Identifier;
  _status?: Element;
  /* proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option */
  intent:
    | 'directive'
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order';
  performer?: Array<
    Reference<
      | 'HealthcareService'
      | 'Organization'
      | 'PractitionerRole'
      | 'Device'
      | 'Patient'
      | 'RelatedPerson'
      | 'CareTeam'
      | 'Practitioner'
    >
  >;
  /* Service amount */
  quantity?: {
    Quantity?: Quantity;
    Range?: Range;
    Ratio?: Ratio;
  };
  reasonReference?: Array<Reference<'DiagnosticReport' | 'Observation' | 'Condition' | 'DocumentReference'>>;
  /* Who/what is requesting service */
  requester?: Reference<'Patient' | 'Device' | 'Practitioner' | 'Organization' | 'PractitionerRole' | 'RelatedPerson'>;
  insurance?: Array<Reference<'Coverage' | 'ClaimResponse'>>;
  bodySite?: CodeableConcept;
  instantiatesUri?: uri;
  /* Patient or consumer-oriented instructions */
  patientInstruction?: string;
  _intent?: Element;
  reasonCode?: CodeableConcept;
  basedOn?: Array<Reference<'ServiceRequest' | 'CarePlan' | 'MedicationRequest'>>;
  locationReference?: Array<Reference<'Location'>>;
  /* Encounter in which the request was created */
  encounter?: Reference<'Encounter'>;
  /* Date request signed */
  authoredOn?: dateTime;
  category?: CodeableConcept;
  /* True if service/procedure should not be performed */
  doNotPerform?: boolean;
  _authoredOn?: Element;
  /* Preconditions for service */
  asNeeded?: {
    boolean?: boolean;
    CodeableConcept?: CodeableConcept;
    _boolean?: Element;
  };
  /* Individual or Entity the service is ordered for */
  subject: Reference<'Device' | 'Location' | 'Group' | 'Patient'>;
}

/* Base StructureDefinition for BackboneElement Type: Base definition for all elements that are defined inside a resource - but not those in a data type. */
export interface BackboneElement extends Element {
  modifierExtension?: Extension;
}

/* Base StructureDefinition for code type: A string which has at least one character and no leading or trailing whitespace and where there is no whitespace other than single spaces in the contents */
export type code = string;
/* Definition for message delivery channel */
export interface Channel extends Resource<'Channel'> {
  /* Channel name */
  name: string;
  systemAccount: Reference<'SystemAccount'>;
  /* Modality configuration (sms,email,voice) */
  modality: {
    providerData?: any;
    'type': 'sms' | 'email' | 'voice';
    provider?: 'twilio' | 'sendgrid';
    status: 'enabled' | 'disabled';
  };
  /* Reference to resource which should use this channel by overriding default channels */
  usedBy?: Reference<'Organization' | 'Location'>;
}

/* Human readable names for the codesystem. */
export interface codesystemOtherName {
  /* Human readable, short and specific */
  name: string;
  /* Which name is preferred for this language */
  preferred?: boolean;
}

/* A record of a clinical assessment performed to determine what problem(s) may affect the patient and before planning the treatments or management strategies that are best to manage a patient's condition. Assessments are often 1:1 with a clinical consultation / encounter,  but this varies greatly depending on the clinical workflow. This resource is called "ClinicalImpression" rather than "ClinicalAssessment" to avoid confusion with the recording of assessment tools such as Apgar score. */
export interface ClinicalImpression extends DomainResource, Resource<'ClinicalImpression'> {
  prognosisReference?: Array<Reference<'RiskAssessment'>>;
  /* Why/how the assessment was performed */
  description?: string;
  /* Summary of the assessment */
  summary?: string;
  /* The clinician performing the assessment */
  assessor?: Reference<'Practitioner' | 'PractitionerRole'>;
  /* Time of assessment */
  effective?: {
    dateTime?: dateTime;
    Period?: Period;
    _dateTime?: Element;
  };
  finding?: {
    _basis?: Element;
    /* Which investigations support finding */
    basis?: string;
    /* What was found */
    itemCodeableConcept?: CodeableConcept;
    /* What was found */
    itemReference?: Reference<'Media' | 'Observation' | 'Condition'>;
  };
  /* Kind of assessment performed */
  code?: CodeableConcept;
  _date?: Element;
  prognosisCodeableConcept?: CodeableConcept;
  investigation?: {
    item?: Array<
      Reference<
        | 'RiskAssessment'
        | 'Observation'
        | 'DiagnosticReport'
        | 'Media'
        | 'FamilyMemberHistory'
        | 'ImagingStudy'
        | 'QuestionnaireResponse'
      >
    >;
    /* A name/code for the set */
    code: CodeableConcept;
  };
  protocol?: uri;
  _description?: Element;
  note?: Annotation;
  /* Reason for current status */
  statusReason?: CodeableConcept;
  /* in-progress | completed | entered-in-error */
  status: 'completed' | 'entered-in-error' | 'in-progress';
  /* Patient or group assessed */
  subject: Reference<'Patient' | 'Group'>;
  supportingInfo?: Array<Reference<'Reference'>>;
  identifier?: Identifier;
  _status?: Element;
  _summary?: Element;
  /* When the assessment was documented */
  date?: dateTime;
  /* Reference to last assessment */
  previous?: Reference<'ClinicalImpression'>;
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  problem?: Array<Reference<'Condition' | 'AllergyIntolerance'>>;
  _protocol?: Element;
}

/* A financial tool for tracking value accrued for a particular purpose.  In the healthcare field, used to track charges for a patient, cost centers, etc. */
export interface Account extends DomainResource, Resource<'Account'> {
  _status?: Element;
  identifier?: Identifier;
  _description?: Element;
  _name?: Element;
  /* Entity managing the Account */
  owner?: Reference<'Organization'>;
  /* Reference to a parent Account */
  partOf?: Reference<'Account'>;
  /* Human-readable label */
  name?: string;
  /* Transaction window */
  servicePeriod?: Period;
  /* active | inactive | entered-in-error | on-hold | unknown */
  status: 'active' | 'entered-in-error' | 'inactive' | 'on-hold' | 'unknown';
  /* E.g. patient, expense, depreciation */
  'type'?: CodeableConcept;
  /* Explanation of purpose/use */
  description?: string;
  subject?: Array<
    Reference<
      'HealthcareService' | 'Organization' | 'Location' | 'Practitioner' | 'Patient' | 'PractitionerRole' | 'Device'
    >
  >;
  guarantor?: {
    /* Guarantee account during */
    period?: Period;
    /* Responsible entity */
    party: Reference<'RelatedPerson' | 'Patient' | 'Organization'>;
    _onHold?: Element;
    /* Credit or other hold applied */
    onHold?: boolean;
  };
  coverage?: {
    /* The priority of the coverage in the context of this account */
    priority?: positiveInt;
    /* The party(s), such as insurances, that may contribute to the payment of this account */
    coverage: Reference<'Coverage'>;
    _priority?: Element;
  };
}

export type RPCgetAccount = {
  method: 'dash.demo/get-account';
  params: {
    account: string;
  };
};
/* The interactions of the medicinal product with other medicinal products, or other forms of interactions. */
export interface MedicinalProductInteraction extends DomainResource, Resource<'MedicinalProductInteraction'> {
  /* The incidence of the interaction, e.g. theoretical, observed */
  incidence?: CodeableConcept;
  interactant?: {
    /* The specific medication, food or laboratory test that interacts */
    item?: {
      CodeableConcept?: CodeableConcept;
      Reference?: Reference<'MedicinalProduct' | 'Medication' | 'Substance' | 'ObservationDefinition'>;
    };
  };
  _description?: Element;
  /* The interaction described */
  description?: string;
  /* Actions for managing the interaction */
  management?: CodeableConcept;
  /* The type of the interaction e.g. drug-drug interaction, drug-food interaction, drug-lab test interaction */
  'type'?: CodeableConcept;
  subject?: Array<Reference<'MedicinalProduct' | 'Substance' | 'Medication'>>;
  /* The effect of the interaction, for example "reduced gastric absorption of primary medication" */
  effect?: CodeableConcept;
}

/* Information on changes made to the Value Set Definition over time, and also has a contained audit trail of all such changes. */
export interface codesystemHistory {
  revision?: {
    /* Version marker after the change was made */
    id: string;
    /* Information about the change */
    notes?: string;
    /* Date the change was made */
    date: dateTime;
    /* Who made the change */
    author: string;
  };
  /* The name of this set of history entries */
  name?: string;
}

/* Common Ancestor declaration for conformance and knowledge artifact resources. */
export interface MetadataResource extends DomainResource {
  _description?: Element;
  _experimental?: Element;
  /* Name of the publisher (organization or individual) */
  publisher?: string;
  /* For testing purposes, not real usage */
  experimental?: boolean;
  _url?: Element;
  /* Date last changed */
  date?: dateTime;
  _status?: Element;
  _title?: Element;
  _version?: Element;
  _name?: Element;
  _date?: Element;
  contact?: ContactDetail;
  /* Natural language description of the metadata resource */
  description?: markdown;
  jurisdiction?: CodeableConcept;
  /* draft | active | retired | unknown */
  status: 'inactive' | 'active' | 'draft' | 'retired' | 'unknown' | 'archived' | 'paused' | 'scheduled';
  /* Name for this metadata resource (human friendly) */
  title?: string;
  /* Canonical identifier for this metadata resource, represented as a URI (globally unique) */
  url?: uri;
  useContext?: UsageContext;
  /* Business version of the metadata resource */
  version?: string;
  _publisher?: Element;
  /* Name for this metadata resource (computer friendly) */
  name?: string;
}

export interface Product extends Resource<'Product'> {
  active: boolean;
  description?: string;
  name: string;
}

export type RPCgetConcepts = {
  method: 'relatient.terminology/get-concepts';
  params: {
    [key: string]: any;
  };
};
export interface User extends Resource<'User'> {
  /* NB: this attr is ignored. A Boolean value indicating the User's administrative status. */
  active?: boolean;
  department?: string;
  link?: {
    'type'?: string;
    link?: Reference;
  };
  userType?: string;
  name?: {
    middleName?: string;
    honorificSuffix?: string;
    givenName?: string;
    familyName?: string;
    formatted?: string;
    honorificPrefix?: string;
  };
  password: string;
  cognito?: {
    userPool: string;
    userId: string;
  };
  systemAccount?: Reference<'SystemAccount'>;
  division?: string;
  organization?: Reference<'Organization'>;
  /* Identifies the name of a cost center. */
  costCenter?: string;
  userName?: string;
  gender?: string;
  emails?: {
    value?: string;
    primary?: boolean;
    'type'?: string;
    display?: string;
  };
  superAdmin?: boolean;
  email?: string;
  data?: any;
}

/* Base StructureDefinition for Signature Type: A signature along with supporting context. The signature may be a digital signature that is cryptographic in nature, or some other signature acceptable to the domain. This other signature may be as simple as a graphical image representing a hand-written signature, or a signature ceremony Different signature approaches have different utilities. */
export interface Signature extends Element {
  _when?: Element;
  /* Who signed */
  who: Reference<'Organization' | 'Device' | 'Patient' | 'PractitionerRole' | 'Practitioner' | 'RelatedPerson'>;
  /* The technical format of the signature */
  sigFormat?: 'application/hl7-cda+xml';
  _data?: Element;
  /* The actual signature content (XML DigSig. JWS, picture, etc.) */
  data?: base64Binary;
  /* The technical format of the signed resources */
  targetFormat?: 'application/hl7-cda+xml';
  _sigFormat?: Element;
  /* When the signature was created */
  when: instant;
  _targetFormat?: Element;
  /* The party represented */
  onBehalfOf?: Reference<'Practitioner' | 'Patient' | 'Organization' | 'Device' | 'RelatedPerson' | 'PractitionerRole'>;
  'type': Array<Coding>;
}

export type RPCloadDataFromAidbox = {
  method: 'dash.demo/load-data-from-aidbox-cli';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for RelatedArtifact Type: Related artifacts such as additional documentation, justification, or bibliographic references. */
export interface RelatedArtifact extends Element {
  _citation?: Element;
  _display?: Element;
  _resource?: Element;
  _url?: Element;
  /* What resource is being referenced */
  resource?: canonical;
  /* documentation | justification | citation | predecessor | successor | derived-from | depends-on | composed-of */
  'type':
    | 'citation'
    | 'composed-of'
    | 'depends-on'
    | 'derived-from'
    | 'documentation'
    | 'justification'
    | 'predecessor'
    | 'successor';
  /* Where the artifact can be accessed */
  url?: url;
  /* Bibliographic citation for the artifact */
  citation?: markdown;
  _type?: Element;
  _label?: Element;
  /* What document is being referenced */
  document?: Attachment;
  /* Short label */
  label?: string;
  /* Brief description of the related artifact */
  display?: string;
}

/* The subscription resource is used to define a push-based subscription from a server to another system. Once a subscription is registered with the server, the server checks every resource that is created or updated, and if the resource matches the given criteria, it sends a message on the defined "channel" so that another system can take an appropriate action. */
export interface Subscription extends DomainResource, Resource<'Subscription'> {
  _status?: Element;
  _criteria?: Element;
  /* The channel on which to report matches to the criteria */
  channel?: {
    header?: string;
    _type?: Element;
    /* Where the channel points to */
    endpoint?: url;
    /* rest-hook | websocket | email | sms | message */
    'type': 'email' | 'message' | 'rest-hook' | 'sms' | 'websocket';
    _header?: Element;
    _payload?: Element;
    _endpoint?: Element;
    /* MIME type to send, or omit for no payload */
    payload?: 'application/hl7-cda+xml';
  };
  /* requested | active | error | off */
  status: 'active' | 'error' | 'off' | 'requested';
  _end?: Element;
  /* Latest error note */
  error?: string;
  _error?: Element;
  contact?: ContactPoint;
  /* Description of why this subscription was created */
  reason: string;
  _reason?: Element;
  /* When to automatically delete the subscription */
  end?: instant;
  /* Rule for server push */
  criteria: string;
}

/* The characteristics, operational status and capabilities of a medical-related component of a medical device. */
export interface DeviceDefinition extends DomainResource, Resource<'DeviceDefinition'> {
  /* Name of device manufacturer */
  manufacturer?: {
    string?: string;
    Reference?: Reference<'Organization'>;
    _string?: Element;
  };
  specialization?: {
    _systemType?: Element;
    _version?: Element;
    /* The standard that is used to operate and communicate */
    systemType: string;
    /* The version of the standard that is used to operate and communicate */
    version?: string;
  };
  property?: {
    valueQuantity?: Quantity;
    /* Code that specifies the property DeviceDefinitionPropetyCode (Extensible) */
    'type': CodeableConcept;
    valueCode?: CodeableConcept;
  };
  contact?: ContactPoint;
  note?: Annotation;
  /* Network address to contact device */
  url?: uri;
  _modelNumber?: Element;
  identifier?: Identifier;
  /* Organization responsible for device */
  owner?: Reference<'Organization'>;
  _version?: Element;
  deviceName?: {
    /* udi-label-name | user-friendly-name | patient-reported-name | manufacturer-name | model-name | other */
    'type':
      | 'manufacturer-name'
      | 'model-name'
      | 'other'
      | 'patient-reported-name'
      | 'udi-label-name'
      | 'user-friendly-name';
    _name?: Element;
    /* The name of the device */
    name: string;
    _type?: Element;
  };
  /* The quantity of the device present in the packaging (e.g. the number of devices present in a pack, or the number of devices in the same package of the medicinal product) */
  quantity?: Quantity;
  /* What kind of device or device system this is */
  'type'?: CodeableConcept;
  capability?: {
    /* Type of capability */
    'type': CodeableConcept;
    description?: CodeableConcept;
  };
  /* The parent device it can be part of */
  parentDevice?: Reference<'DeviceDefinition'>;
  version?: string;
  /* The model number for the device */
  modelNumber?: string;
  _url?: Element;
  material?: {
    /* Whether the substance is a known or suspected allergen */
    allergenicIndicator?: boolean;
    _allergenicIndicator?: Element;
    /* The substance */
    substance: CodeableConcept;
    /* Indicates an alternative material of the device */
    alternate?: boolean;
    _alternate?: Element;
  };
  /* Dimensions, color etc. */
  physicalCharacteristics?: ProdCharacteristic;
  safety?: CodeableConcept;
  shelfLifeStorage?: ProductShelfLife;
  _onlineInformation?: Element;
  languageCode?: CodeableConcept;
  udiDeviceIdentifier?: {
    _jurisdiction?: Element;
    _issuer?: Element;
    _deviceIdentifier?: Element;
    /* The identifier that is to be associated with every Device that references this DeviceDefintiion for the issuer and jurisdication porvided in the DeviceDefinition.udiDeviceIdentifier */
    deviceIdentifier: string;
    /* The organization that assigns the identifier algorithm */
    issuer: uri;
    /* The jurisdiction to which the deviceIdentifier applies */
    jurisdiction: uri;
  };
  /* Access to on-line information */
  onlineInformation?: uri;
}

/* A medicinal product in a container or package. */
export interface MedicinalProductPackaged extends DomainResource, Resource<'MedicinalProductPackaged'> {
  /* Manufacturer of this Package Item */
  marketingAuthorization?: Reference<'MedicinalProductAuthorization'>;
  marketingStatus?: MarketingStatus;
  identifier?: Identifier;
  batchIdentifier?: {
    /* A number appearing on the outer packaging of a specific batch */
    outerPackaging: Identifier;
    /* A number appearing on the immediate packaging (and not the outer packaging) */
    immediatePackaging?: Identifier;
  };
  /* Textual description */
  description?: string;
  manufacturer?: Array<Reference<'Organization'>>;
  _description?: Element;
  /* The legal status of supply of the medicinal product as classified by the regulator */
  legalStatusOfSupply?: CodeableConcept;
  packageItem: {
    otherCharacteristics?: CodeableConcept;
    /* The physical type of the container of the medicine */
    'type': CodeableConcept;
    alternateMaterial?: CodeableConcept;
    material?: CodeableConcept;
    manufacturedItem?: Array<Reference<'MedicinalProductManufactured'>>;
    shelfLifeStorage?: ProductShelfLife;
    /* Dimensions, color etc. */
    physicalCharacteristics?: ProdCharacteristic;
    packageItem?: any;
    manufacturer?: Array<Reference<'Organization'>>;
    device?: Array<Reference<'DeviceDefinition'>>;
    identifier?: Identifier;
    /* The quantity of this package in the medicinal product, at the current level of packaging. The outermost is always 1 */
    quantity: Quantity;
  };
  subject?: Array<Reference<'MedicinalProduct'>>;
}

/* A regular expression that defines the syntax for the data element to be considered valid. */
export type regex = string;
export type RPCfindDoctors = {
  method: 'relatient.self-scheduling/find-doctors';
  params: {
    [key: string]: any;
  };
};
export type RPCgetSlots = {
  method: 'relatient.workshift/get-slots';
  params: {
    [key: string]: any;
  };
};
/* An order or request for both supply of the medication and the instructions for administration of the medication to a patient. The resource is called "MedicationRequest" rather than "MedicationPrescription" or "MedicationOrder" to generalize the use across inpatient and outpatient settings, including care plans, etc., and to harmonize with workflow patterns. */
export interface MedicationRequest extends DomainResource, Resource<'MedicationRequest'> {
  /* Who/What requested the Request */
  requester?: Reference<'Practitioner' | 'Patient' | 'Organization' | 'Device' | 'RelatedPerson' | 'PractitionerRole'>;
  /* Who or group medication request is for */
  subject: Reference<'Patient' | 'Group'>;
  identifier?: Identifier;
  supportingInformation?: Array<Reference<'Reference'>>;
  _instantiatesCanonical?: Element;
  _doNotPerform?: Element;
  reasonCode?: CodeableConcept;
  basedOn?: Array<Reference<'MedicationRequest' | 'ImmunizationRecommendation' | 'ServiceRequest' | 'CarePlan'>>;
  /* True if request is prohibiting action */
  doNotPerform?: boolean;
  eventHistory?: Array<Reference<'Provenance'>>;
  /* Medication to be taken */
  medication?: {
    CodeableConcept?: CodeableConcept;
    Reference?: Reference<'Medication'>;
  };
  /* Person who entered the request */
  recorder?: Reference<'Practitioner' | 'PractitionerRole'>;
  /* active | on-hold | cancelled | completed | entered-in-error | stopped | draft | unknown */
  status:
    | 'active'
    | 'cancelled'
    | 'completed'
    | 'draft'
    | 'entered-in-error'
    | 'on-hold'
    | 'stopped'
    | 'unknown'
    | 'altchoice'
    | 'clarif'
    | 'drughigh'
    | 'hospadm'
    | 'labint'
    | 'non-avail'
    | 'preg'
    | 'salg'
    | 'sddi'
    | 'sdupther'
    | 'sintol'
    | 'surg'
    | 'washout';
  /* Desired kind of performer of the medication administration */
  performerType?: CodeableConcept;
  _intent?: Element;
  /* Composite request this is part of */
  groupIdentifier?: Identifier;
  instantiatesUri?: uri;
  /* routine | urgent | asap | stat */
  priority?: 'asap' | 'routine' | 'stat' | 'urgent';
  _authoredOn?: Element;
  /* When request was initially authored */
  authoredOn?: dateTime;
  instantiatesCanonical?: canonical;
  detectedIssue?: Array<Reference<'DetectedIssue'>>;
  /* Reported rather than primary record */
  reported?: {
    Reference?: Reference<'PractitionerRole' | 'RelatedPerson' | 'Patient' | 'Practitioner' | 'Organization'>;
    _boolean?: Element;
    boolean?: boolean;
  };
  /* Overall pattern of medication administration */
  courseOfTherapyType?: CodeableConcept;
  category?: CodeableConcept;
  /* Medication supply authorization */
  dispenseRequest?: {
    /* Number of refills authorized */
    numberOfRepeatsAllowed?: unsignedInt;
    /* Amount of medication to supply per dispense */
    quantity?: Quantity;
    /* First fill details */
    initialFill?: {
      /* First fill duration */
      duration?: Duration;
      /* First fill quantity */
      quantity?: Quantity;
    };
    /* Number of days supply per dispense */
    expectedSupplyDuration?: Duration;
    /* Intended dispenser */
    performer?: Reference<'Organization'>;
    _numberOfRepeatsAllowed?: Element;
    /* Time period supply is authorized for */
    validityPeriod?: Period;
    /* Minimum period of time between dispenses */
    dispenseInterval?: Duration;
  };
  _instantiatesUri?: Element;
  /* An order/prescription that is being replaced */
  priorPrescription?: Reference<'MedicationRequest'>;
  /* Any restrictions on medication substitution */
  substitution?: {
    /* Whether substitution is allowed or not */
    allowed?: {
      boolean?: boolean;
      CodeableConcept?: CodeableConcept;
      _boolean?: Element;
    };
    /* Why should (not) substitution be made */
    reason?: CodeableConcept;
  };
  insurance?: Array<Reference<'Coverage' | 'ClaimResponse'>>;
  /* Encounter created as part of encounter/admission/stay */
  encounter?: Reference<'Encounter'>;
  _priority?: Element;
  reasonReference?: Array<Reference<'Observation' | 'Condition'>>;
  note?: Annotation;
  dosageInstruction?: Dosage;
  /* Reason for current status */
  statusReason?: CodeableConcept;
  _status?: Element;
  /* Intended performer of administration */
  performer?: Reference<
    'Patient' | 'PractitionerRole' | 'Device' | 'Practitioner' | 'RelatedPerson' | 'CareTeam' | 'Organization'
  >;
  /* proposal | plan | order | original-order | reflex-order | filler-order | instance-order | option */
  intent:
    | 'filler-order'
    | 'instance-order'
    | 'option'
    | 'order'
    | 'original-order'
    | 'plan'
    | 'proposal'
    | 'reflex-order';
}

/* A collection of documents compiled for a purpose together with metadata that applies to the collection. */
export interface DocumentManifest extends DomainResource, Resource<'DocumentManifest'> {
  related?: {
    /* Related Resource */
    ref?: Reference<'Reference'>;
    /* Identifiers of things that are related */
    identifier?: Identifier;
  };
  _created?: Element;
  /* Unique Identifier for the set of documents */
  masterIdentifier?: Identifier;
  _description?: Element;
  /* current | superseded | entered-in-error */
  status: 'current' | 'entered-in-error' | 'superseded';
  /* Kind of document set */
  'type'?: CodeableConcept;
  recipient?: Array<Reference<'PractitionerRole' | 'Practitioner' | 'Organization' | 'RelatedPerson' | 'Patient'>>;
  content: Array<Reference<'Reference'>>;
  _source?: Element;
  _status?: Element;
  identifier?: Identifier;
  /* The source system/application/software */
  source?: uri;
  /* When this document manifest created */
  created?: dateTime;
  author?: Array<
    Reference<'Device' | 'Organization' | 'PractitionerRole' | 'Practitioner' | 'RelatedPerson' | 'Patient'>
  >;
  /* Human-readable description (title) */
  description?: string;
  /* The subject of the set of documents */
  subject?: Reference<'Patient' | 'Practitioner' | 'Group' | 'Device'>;
}

/* Base StructureDefinition for instant Type: An instant in time - known at least to the second */
export type instant = string;
export type RPCupdateValueset = {
  method: 'relatient.terminology/update-valueset';
  params: {
    [key: string]: any;
  };
};
/* Base StructureDefinition for Timing Type: Specifies an event that may occur multiple times. Timing schedules are used to record when things are planned, expected or requested to occur. The most common usage is in dosage instructions for medications. They are also used when planning care of various kinds, and may be used for reporting the schedule to which past regular activities were carried out. */
export interface Timing extends BackboneElement {
  /* BID | TID | QID | AM | PM | QD | QOD | + */
  code?:
    | 'AM'
    | 'BED'
    | 'BID'
    | 'MO'
    | 'PM'
    | 'Q1H'
    | 'Q2H'
    | 'Q3H'
    | 'Q4H'
    | 'Q6H'
    | 'Q8H'
    | 'QD'
    | 'QID'
    | 'QOD'
    | 'TID'
    | 'WK';
  /* When the event is to occur */
  repeat?: {
    _durationMax?: Element;
    dayOfWeek?: Array<'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed'>;
    _duration?: Element;
    _when?: Element;
    /* Upper limit of period (3-4 hours) */
    periodMax?: decimal;
    when?: Array<
      | 'AFT'
      | 'AFT.early'
      | 'AFT.late'
      | 'EVE'
      | 'EVE.early'
      | 'EVE.late'
      | 'MORN'
      | 'MORN.early'
      | 'MORN.late'
      | 'NIGHT'
      | 'NOON'
      | 'PHS'
      | 'AC'
      | 'ACD'
      | 'ACM'
      | 'ACV'
      | 'C'
      | 'CD'
      | 'CM'
      | 'CV'
      | 'HS'
      | 'PC'
      | 'PCD'
      | 'PCM'
      | 'PCV'
      | 'WAKE'
    >;
    _timeOfDay?: Element;
    _periodUnit?: Element;
    _offset?: Element;
    /* Number of times to repeat */
    count?: positiveInt;
    /* Minutes from event (before or after) */
    offset?: unsignedInt;
    _dayOfWeek?: Element;
    _frequencyMax?: Element;
    timeOfDay?: time;
    /* s | min | h | d | wk | mo | a - unit of time (UCUM) */
    periodUnit?: 'h' | 'min' | 'mo' | 's' | 'wk' | 'a' | 'd';
    _frequency?: Element;
    /* Event occurs frequency times per period */
    frequency?: positiveInt;
    /* Length/Range of lengths, or (Start and/or end) limits */
    bounds?: {
      Duration?: Duration;
      Period?: Period;
      Range?: Range;
    };
    _durationUnit?: Element;
    _count?: Element;
    /* s | min | h | d | wk | mo | a - unit of time (UCUM) */
    durationUnit?: 'h' | 'min' | 'mo' | 's' | 'wk' | 'a' | 'd';
    /* Event occurs frequency times per period */
    period?: decimal;
    _periodMax?: Element;
    /* Maximum number of times to repeat */
    countMax?: positiveInt;
    /* How long when it happens (Max) */
    durationMax?: decimal;
    /* Event occurs up to frequencyMax times per period */
    frequencyMax?: positiveInt;
    /* How long when it happens */
    duration?: decimal;
    _countMax?: Element;
    _period?: Element;
  };
  _event?: Element;
  event?: dateTime;
}

/* This resource provides the details including amount of a payment and allocates the payment items being paid. */
export interface PaymentReconciliation extends DomainResource, Resource<'PaymentReconciliation'> {
  detail?: {
    /* Recipient of the payment */
    payee?: Reference<'Organization' | 'Practitioner' | 'PractitionerRole'>;
    /* Request giving rise to the payment */
    request?: Reference<'Reference'>;
    /* Response committing to a payment */
    response?: Reference<'Reference'>;
    /* Submitter of the request */
    submitter?: Reference<'Practitioner' | 'PractitionerRole' | 'Organization'>;
    /* Category of payment */
    'type': CodeableConcept;
    _date?: Element;
    /* Amount allocated to this payable */
    amount?: Money;
    /* Business identifier of the payment detail */
    identifier?: Identifier;
    /* Date of commitment to pay */
    date?: date;
    /* Business identifier of the prior payment detail */
    predecessor?: Identifier;
    /* Contact for the response */
    responsible?: Reference<'PractitionerRole'>;
  };
  /* Creation date */
  created: dateTime;
  identifier?: Identifier;
  /* Party generating payment */
  paymentIssuer?: Reference<'Organization'>;
  /* When payment issued */
  paymentDate: date;
  processNote?: {
    /* Note explanatory text */
    text?: string;
    _text?: Element;
    _type?: Element;
    /* display | print | printoper */
    'type'?: 'display' | 'print' | 'printoper';
  };
  /* active | cancelled | draft | entered-in-error */
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  /* Printed form identifier */
  formCode?: CodeableConcept;
  /* Business identifier for the payment */
  paymentIdentifier?: Identifier;
  /* Total amount of Payment */
  paymentAmount: Money;
  /* Responsible practitioner */
  requestor?: Reference<'PractitionerRole' | 'Organization' | 'Practitioner'>;
  /* Reference to requesting resource */
  request?: Reference<'Task'>;
  _disposition?: Element;
  _paymentDate?: Element;
  /* Period covered */
  period?: Period;
  /* queued | complete | error | partial */
  outcome?: 'complete' | 'error' | 'partial' | 'queued';
  _created?: Element;
  _status?: Element;
  /* Disposition message */
  disposition?: string;
  _outcome?: Element;
}

/* An action that is or was performed on or for a patient. This can be a physical intervention like an operation, or less invasive like long term services, counseling, or hypnotherapy. */
export interface Procedure extends DomainResource, Resource<'Procedure'> {
  /* When the procedure was performed */
  performed?: {
    Age?: Age;
    _dateTime?: Element;
    _string?: Element;
    Period?: Period;
    Range?: Range;
    dateTime?: dateTime;
    string?: string;
  };
  complicationDetail?: Array<Reference<'Condition'>>;
  instantiatesUri?: uri;
  /* Identification of the procedure */
  code?: CodeableConcept;
  /* Classification of the procedure */
  category?: CodeableConcept;
  complication?: CodeableConcept;
  usedCode?: CodeableConcept;
  usedReference?: Array<Reference<'Medication' | 'Substance' | 'Device'>>;
  /* Who the procedure was performed on */
  subject: Reference<'Group' | 'Patient'>;
  identifier?: Identifier;
  performer?: {
    /* Organization the device or practitioner was acting for */
    onBehalfOf?: Reference<'Organization'>;
    /* Type of performance */
    function?: CodeableConcept;
    /* The reference to the practitioner */
    actor: Reference<'PractitionerRole' | 'Patient' | 'Device' | 'RelatedPerson' | 'Practitioner' | 'Organization'>;
  };
  /* Encounter created as part of */
  encounter?: Reference<'Encounter'>;
  /* Reason for current status */
  statusReason?: CodeableConcept;
  reasonReference?: Array<
    Reference<'Condition' | 'Procedure' | 'DiagnosticReport' | 'Observation' | 'DocumentReference'>
  >;
  /* Person who asserts this procedure */
  asserter?: Reference<'Patient' | 'RelatedPerson' | 'Practitioner' | 'PractitionerRole'>;
  reasonCode?: CodeableConcept;
  focalDevice?: {
    /* Device that was changed */
    manipulated: Reference<'Device'>;
    /* Kind of change to device */
    action?: 'CodeableConcept';
  };
  /* The result of procedure */
  outcome?: CodeableConcept;
  /* preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown */
  status:
    | 'completed'
    | 'entered-in-error'
    | 'in-progress'
    | 'not-done'
    | 'on-hold'
    | 'preparation'
    | 'stopped'
    | 'unknown';
  _instantiatesCanonical?: Element;
  /* Who recorded the procedure */
  recorder?: Reference<'PractitionerRole' | 'Practitioner' | 'Patient' | 'RelatedPerson'>;
  followUp?: CodeableConcept;
  instantiatesCanonical?: canonical;
  note?: Annotation;
  _status?: Element;
  partOf?: Array<Reference<'MedicationAdministration' | 'Procedure' | 'Observation'>>;
  report?: Array<Reference<'Composition' | 'DocumentReference' | 'DiagnosticReport'>>;
  _instantiatesUri?: Element;
  bodySite?: CodeableConcept;
  /* Where the procedure happened */
  location?: Reference<'Location'>;
  basedOn?: Array<Reference<'CarePlan' | 'ServiceRequest'>>;
}

/* Knowledge-based comments on the effect of the sequence on patient's condition/medication reaction. */
export interface DiagnosticReportGeneticsAnalysis {
  /* Analysis interpretation */
  interpretation?: CodeableConcept;
  /* Analysis type */
  'type': CodeableConcept;
}

export type RPCbookSlot = {
  method: 'relatient.pmsystem/book-slot';
  params: {
    'slot-id': string;
    'new-patient'?: {
      dob?: string;
      firstname?: string;
      email?: string;
      lastname?: string;
    };
    account: string;
    date?: string;
  };
};
/* Describes the intended objective(s) for a patient, group or organization care, for example, weight loss, restoring an activity of daily living, obtaining herd immunity via immunization, meeting a process improvement objective, etc. */
export interface Goal extends DomainResource, Resource<'Goal'> {
  addresses?: Array<
    Reference<
      'Condition' | 'MedicationStatement' | 'Observation' | 'RiskAssessment' | 'NutritionOrder' | 'ServiceRequest'
    >
  >;
  outcomeCode?: CodeableConcept;
  _statusReason?: Element;
  /* When goal status took effect */
  statusDate?: date;
  outcomeReference?: Array<Reference<'Observation'>>;
  /* proposed | planned | accepted | active | on-hold | completed | cancelled | entered-in-error | rejected */
  lifecycleStatus:
    | 'accepted'
    | 'active'
    | 'cancelled'
    | 'completed'
    | 'entered-in-error'
    | 'on-hold'
    | 'planned'
    | 'proposed'
    | 'financial-barrier'
    | 'lack-of-social-support'
    | 'lack-of-transportation'
    | 'life-event'
    | 'patient-request'
    | 'permanent-not-attainable'
    | 'replaced'
    | 'surgery'
    | 'temp-not-attainable'
    | 'rejected';
  note?: Annotation;
  _statusDate?: Element;
  /* Code or text describing goal */
  description: CodeableConcept;
  /* high-priority | medium-priority | low-priority */
  priority?: 'high-priority' | 'low-priority' | 'medium-priority';
  identifier?: Identifier;
  category?: CodeableConcept;
  /* in-progress | improving | worsening | no-change | achieved | sustaining | not-achieved | no-progress | not-attainable */
  achievementStatus?:
    | 'achieved'
    | 'improving'
    | 'in-progress'
    | 'no-change'
    | 'no-progress'
    | 'not-achieved'
    | 'not-attainable'
    | 'sustaining'
    | 'worsening';
  target?: {
    /* The parameter whose value is being tracked */
    measure?: CodeableConcept;
    /* Reach goal on or before */
    due?: {
      Duration?: Duration;
      _date?: Element;
      date?: date;
    };
    /* The target value to be achieved */
    detail?: {
      boolean?: boolean;
      Range?: Range;
      string?: string;
      _integer?: Element;
      _string?: Element;
      Quantity?: Quantity;
      Ratio?: Ratio;
      CodeableConcept?: CodeableConcept;
      _boolean?: Element;
      integer?: integer;
    };
  };
  _lifecycleStatus?: Element;
  /* When goal pursuit begins */
  start?: {
    CodeableConcept?: CodeableConcept;
    _date?: Element;
    date?: date;
  };
  /* Reason for current status */
  statusReason?: string;
  /* Who this goal is intended for */
  subject: Reference<'Organization' | 'Group' | 'Patient'>;
  /* Who's responsible for creating Goal? */
  expressedBy?: Reference<'Patient' | 'PractitionerRole' | 'Practitioner' | 'RelatedPerson'>;
}

export interface Organization extends DomainResource, Resource<'Organization'> {
  /* Name used for the organization */
  name?: string;
  /* The organization of which this organization forms a part */
  partOf?: Reference<'Organization'>;
  alias?: string;
  telecom?: ContactPoint;
  address?: Address;
  'type'?: CodeableConcept;
  contact?: {
    /* A name associated with the contact */
    name?: HumanName;
    telecom?: ContactPoint;
    /* The type of contact */
    purpose?: CodeableConcept;
    /* Visiting or postal addresses for the contact */
    address?: Address;
  };
  identifier?: Identifier;
  _active?: Element;
  /* Whether the organization's record is still in active use */
  active?: boolean;
  _name?: Element;
  endpoint?: Array<Reference<'Endpoint'>>;
  _alias?: Element;
}

export interface Appointment extends DomainResource, Resource<'Appointment'> {
  /* The style of appointment or patient that has been booked in the slot (not service type) */
  appointmentType?: 'EMERGENCY' | 'FOLLOWUP' | 'ROUTINE' | 'WALKIN' | 'CHECKUP';
  /* Shown on a subject line in a meeting request, or appointment list */
  description?: string;
  reasonReference?: Array<Reference<'ImmunizationRecommendation' | 'Procedure' | 'Condition' | 'Observation'>>;
  _minutesDuration?: Element;
  /* Can be less than start/end (e.g. estimate) */
  minutesDuration?: positiveInt;
  participant: {
    _status?: Element;
    _required?: Element;
    /* Person, Location/HealthcareService or Device */
    actor?: Reference<
      'Patient' | 'Device' | 'Practitioner' | 'PractitionerRole' | 'RelatedPerson' | 'Location' | 'HealthcareService'
    >;
    /* accepted | declined | tentative | needs-action */
    status: 'accepted' | 'declined' | 'needs-action' | 'tentative';
    /* Participation period of the actor */
    period?: Period;
    /* required | optional | information-only */
    required?: 'information-only' | 'optional' | 'required';
    'type'?: CodeableConcept;
  };
  requestedPeriod?: Period;
  _priority?: Element;
  supportingInformation?: Array<Reference<'Reference'>>;
  _description?: Element;
  /* Additional comments */
  comment?: string;
  /* proposed | pending | booked | arrived | fulfilled | cancelled | noshow | entered-in-error | checked-in | waitlist */
  status:
    | 'arrived'
    | 'booked'
    | 'cancelled'
    | 'checked-in'
    | 'entered-in-error'
    | 'fulfilled'
    | 'noshow'
    | 'pending'
    | 'proposed'
    | 'waitlist';
  _patientInstruction?: Element;
  serviceCategory?: CodeableConcept;
  /* When appointment is to conclude */
  end?: instant;
  specialty?: Array<CodeableConcept>;
  reasonCode?: Array<CodeableConcept>;
  _created?: Element;
  /* The coded reason for the appointment being cancelled */
  cancelationReason?: CodeableConcept;
  /* Detailed information and instructions for the patient */
  patientInstruction?: string;
  identifier?: Identifier;
  /* When appointment is to take place */
  start?: instant;
  _end?: Element;
  slot?: Array<Reference<'Slot' | 'XSlot'>>;
  _comment?: Element;
  _start?: Element;
  basedOn?: Array<Reference<'ServiceRequest'>>;
  /* The date that this appointment was initially created */
  created?: dateTime;
  /* Used to make informed decisions if needing to re-prioritize */
  priority?: unsignedInt;
  serviceType?: CodeableConcept;
  _status?: Element;
}

/* Base StructureDefinition for Ratio Type: A relationship of two Quantity values - expressed as a numerator and a denominator. */
export interface Ratio extends Element {
  /* Denominator value */
  denominator?: Quantity;
  /* Numerator value */
  numerator?: Quantity;
}

/* A date/time value that is determined based on a duration offset from a target event. */
export interface cqfRelativeDateTime {
  /* Relative to which element on the event */
  targetPath: string;
  /* Relative to what event */
  target: Reference<'Reference'>;
  /* How long */
  offset?: {
    Range?: Range;
    Duration?: Duration;
  };
  /* before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end */
  relationship:
    | 'after'
    | 'after-end'
    | 'after-start'
    | 'before'
    | 'before-end'
    | 'before-start'
    | 'concurrent'
    | 'concurrent-with-end'
    | 'concurrent-with-start';
}

/* Further conditions, problems, diagnoses, procedures or events or the substance that preceded this Condition. */
export interface conditionOccurredFollowing {
  CodeableConcept?: CodeableConcept;
  Reference?: Reference<
    'MedicationStatement' | 'Condition' | 'Procedure' | 'Immunization' | 'MedicationAdministration'
  >;
}

export interface Configuration extends Resource<'Configuration'> {
  [key: string]: any;
}

export type EntityList = {
  SubstanceSpecification: SubstanceSpecification;
  Linkage: Linkage;
  ActivityDefinition: ActivityDefinition;
  Evidence: Evidence;
  AppointmentResponse: AppointmentResponse;
  Feature: Feature;
  RoleBinding: RoleBinding;
  SystemAccount: SystemAccount;
  DetectedIssue: DetectedIssue;
  Invoice: Invoice;
  AudienceGroupPatientBinding: AudienceGroupPatientBinding;
  DiagnosticReport: DiagnosticReport;
  ServiceLink: ServiceLink;
  GraphDefinition: GraphDefinition;
  MedicationDispense: MedicationDispense;
  SubstanceSourceMaterial: SubstanceSourceMaterial;
  Coverage: Coverage;
  RelatedPerson: RelatedPerson;
  SubstanceNucleicAcid: SubstanceNucleicAcid;
  OperationOutcome: OperationOutcome;
  CodeSystem: CodeSystem;
  InsurancePlan: InsurancePlan;
  NamingSystem: NamingSystem;
  Flag: Flag;
  Composition: Composition;
  Provenance: Provenance;
  Questionnaire: Questionnaire;
  Group: Group;
  VisionPrescription: VisionPrescription;
  MedicinalProduct: MedicinalProduct;
  AllergyIntolerance: AllergyIntolerance;
  SubstanceReferenceInformation: SubstanceReferenceInformation;
  Person: Person;
  PractitionerRole: PractitionerRole;
  FamilyMemberHistory: FamilyMemberHistory;
  Endpoint: Endpoint;
  StructureDefinition: StructureDefinition;
  EnrollmentRequest: EnrollmentRequest;
  DeviceRequest: DeviceRequest;
  CarePlan: CarePlan;
  Task: Task;
  EventLog: EventLog;
  FeatureBinding: FeatureBinding;
  BodyStructure: BodyStructure;
  FeaturesConfig: FeaturesConfig;
  ResearchDefinition: ResearchDefinition;
  QuestionnaireResponse: QuestionnaireResponse;
  Campaign: Campaign;
  MedicinalProductContraindication: MedicinalProductContraindication;
  DocumentReference: DocumentReference;
  MedicinalProductIngredient: MedicinalProductIngredient;
  MedicationKnowledge: MedicationKnowledge;
  ChargeItemDefinition: ChargeItemDefinition;
  Location: Location;
  HealthcareService: HealthcareService;
  SubstancePolymer: SubstancePolymer;
  CoverageEligibilityResponse: CoverageEligibilityResponse;
  Resource: Resource;
  AdverseEvent: AdverseEvent;
  ResearchStudy: ResearchStudy;
  CampaignGroup: CampaignGroup;
  Consent: Consent;
  Measure: Measure;
  MedicationAdministration: MedicationAdministration;
  EnrollmentResponse: EnrollmentResponse;
  Bundle: Bundle;
  CoverageEligibilityRequest: CoverageEligibilityRequest;
  Patient: Patient;
  NutritionOrder: NutritionOrder;
  Parameters: Parameters;
  CustomRule: CustomRule;
  CompartmentDefinition: CompartmentDefinition;
  ImmunizationEvaluation: ImmunizationEvaluation;
  ChargeItem: ChargeItem;
  ImmunizationRecommendation: ImmunizationRecommendation;
  MessageHeader: MessageHeader;
  OperationDefinition: OperationDefinition;
  Immunization: Immunization;
  List: List;
  Broadcast: Broadcast;
  Role: Role;
  PlanDefinition: PlanDefinition;
  Contract: Contract;
  ConceptMap: ConceptMap;
  Specimen: Specimen;
  Communication: Communication;
  MedicinalProductUndesirableEffect: MedicinalProductUndesirableEffect;
  RequestGroup: RequestGroup;
  EpisodeOfCare: EpisodeOfCare;
  AuditEvent: AuditEvent;
  CareTeam: CareTeam;
  MeasureReport: MeasureReport;
  Media: Media;
  ObservationDefinition: ObservationDefinition;
  Practitioner: Practitioner;
  XSlot: XSlot;
  Medication: Medication;
  MolecularSequence: MolecularSequence;
  StructureMap: StructureMap;
  BiologicallyDerivedProduct: BiologicallyDerivedProduct;
  SubstanceProtein: SubstanceProtein;
  TerminologyCapabilities: TerminologyCapabilities;
  RiskAssessment: RiskAssessment;
  GuidanceResponse: GuidanceResponse;
  EmailReport: EmailReport;
  ImplementationGuide: ImplementationGuide;
  EliminateRule: EliminateRule;
  RiskEvidenceSynthesis: RiskEvidenceSynthesis;
  ResearchElementDefinition: ResearchElementDefinition;
  PmSystem: PmSystem;
  EmailSchedule: EmailSchedule;
  SupplyDelivery: SupplyDelivery;
  OrganizationAffiliation: OrganizationAffiliation;
  AppointmentRequest: AppointmentRequest;
  PaymentNotice: PaymentNotice;
  ImagingStudy: ImagingStudy;
  CustomAttribute: CustomAttribute;
  Recall: Recall;
  Claim: Claim;
  CommunicationRequest: CommunicationRequest;
  CapabilityStatement: CapabilityStatement;
  Device: Device;
  EventDefinition: EventDefinition;
  HolidaysCalendar: HolidaysCalendar;
  MedicinalProductAuthorization: MedicinalProductAuthorization;
  Schedule: Schedule;
  Encounter: Encounter;
  ExplanationOfBenefit: ExplanationOfBenefit;
  SpecimenDefinition: SpecimenDefinition;
  MedicinalProductManufactured: MedicinalProductManufactured;
  TestReport: TestReport;
  Observation: Observation;
  Condition: Condition;
  Library: Library;
  AudienceGroup: AudienceGroup;
  SupplyRequest: SupplyRequest;
  DeviceMetric: DeviceMetric;
  TestScript: TestScript;
  Substance: Substance;
  SearchParameter: SearchParameter;
  MessageDefinition: MessageDefinition;
  CatalogEntry: CatalogEntry;
  ResearchSubject: ResearchSubject;
  ClaimResponse: ClaimResponse;
  ExampleScenario: ExampleScenario;
  AccountProduct: AccountProduct;
  MedicationStatement: MedicationStatement;
  MedicinalProductPharmaceutical: MedicinalProductPharmaceutical;
  Binary: Binary;
  MessageTemplate: MessageTemplate;
  Permission: Permission;
  EmailSetting: EmailSetting;
  ValueSet: ValueSet;
  MedicinalProductIndication: MedicinalProductIndication;
  Basic: Basic;
  EffectEvidenceSynthesis: EffectEvidenceSynthesis;
  DeviceUseStatement: DeviceUseStatement;
  Slot: Slot;
  VerificationResult: VerificationResult;
  EvidenceVariable: EvidenceVariable;
  ServiceRequest: ServiceRequest;
  Channel: Channel;
  ClinicalImpression: ClinicalImpression;
  Account: Account;
  MedicinalProductInteraction: MedicinalProductInteraction;
  Product: Product;
  User: User;
  Subscription: Subscription;
  DeviceDefinition: DeviceDefinition;
  MedicinalProductPackaged: MedicinalProductPackaged;
  MedicationRequest: MedicationRequest;
  DocumentManifest: DocumentManifest;
  PaymentReconciliation: PaymentReconciliation;
  Procedure: Procedure;
  Goal: Goal;
  Organization: Organization;
  Appointment: Appointment;
  Configuration: Configuration;
};

export type EntityType = keyof EntityList;
export type Entity<T extends EntityType | void = void> = T extends EntityType ? EntityList[T] : EntityList;
