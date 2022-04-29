import { AxiosInstance } from "axios";

export type ConnectionSource = {
  box: string;
  client: string;
  secret: string;
};

export type Cache = {
  confirms: Map<string, string>;
  primitives: Map<string, string>;
  schema: Map<string, ZenSchema>;
  valueSets: Map<string, string[]>;
  cachePath: string;
  clearFolder: () => void;
  save: () => void;
  saveIntermediateTypes: (types: Types) => void;
};

export type Box = {
  instance: AxiosInstance;
  loadAllSymbols: (
    excludeNamespaces: Array<RegExp>,
    excludedTags: string[],
    cachePath: string,
    useFromFileSystem?: boolean,
  ) => Promise<string[]>;
  getSymbol: (symbol: string) => Promise<ZenSchema>;
  getConcept: (symbol: string) => Promise<string[]>;
  healthCheck: () => Promise<boolean>;
};

export type TypesElementPart = {
  desc?: string;
  type?: string | Record<string, TypesElementPart>;
  source?: boolean;
  require?: boolean;
  extends?: string[];
  array?: boolean;
  defs?: Record<string, TypesElementPart>;
};

export type TypesElement = TypesElementPart & {
  name: string;
};

export type Types = Record<string, TypesElementPart>;

export type ZenSchemaKeys = {
  type?: ZenType;
  "zen/desc"?: string;
  confirms?: string[];
  "fhir/polymorphic"?: boolean;
  "zen.fhir/reference"?: {
    refers: string[];
  };
  "zen.fhir/value-set"?: { symbol: string };
  "validation-type"?: "open";
  enum?: {
    value: string;
  }[];
  values?: {
    type?: string;
    keys?: { [key: string]: ZenSchemaKeys };
    require?: string[];
  };
  require?: string[];
  keys?: { [key: string]: ZenSchemaKeys };
  every?: {
    "zen.fhir/value-set"?: { symbol: string };
    "validation-type"?: "open";
    require?: string[];
    keys?: { [key: string]: ZenSchemaKeys };
    type?: ZenType;
    confirms?: string[];
    "zen.fhir/reference"?: {
      refers: string[];
    };
    enum?: {
      value: string;
    }[];
  };
};

export type ZenSchema = {
  "zen/tags": string[];
  "zen/desc"?: string;
  "fhir/polymorphic"?: boolean;
  confirms?: string[];
  require?: string[];
  "zen.fhir/type"?: string;
  resourceType: string;
  "zen/name": string;
  uri: string;
  "validation-type"?: "open";
  type?: ZenType;
  values?: {
    type?: ZenType;
    keys?: { [key: string]: ZenSchemaKeys };
    require?: string[];
  };
  keys?: { [key: string]: ZenSchemaKeys };
  params?: {
    type: ZenType;
    "validation-type": "open";
    require?: string[];
  };
};

export type ZenPrimitiveType =
  | "zen/string"
  | "zen/boolean"
  | "zen/date"
  | "zen/datetime"
  | "zen/number"
  | "zen/integer"
  | "zen/any";

export type ZenCompositeType = "zen/map" | "zen/vector";

export type ZenType = ZenPrimitiveType | ZenCompositeType;
export type TypeScriptPrimitive =
  | "number"
  | "string"
  | "boolean"
  | "integer"
  | "dateTime"
  | "date"
  | "any"
  | "Array<Coding>"
  | "Array<CodeableConcept>";

export type CLIGenerateTypes = {
  box: string;
  client: string;
  secret: string;
  cachePath?: string;
  cache: boolean;
  fhirReference: boolean;
  output: string;
  includeProfile: boolean;
};

export type ConceptEntry = {
  resource?: {
    code?: string;
  };
};
