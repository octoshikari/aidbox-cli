import {
    HumanName,
    Patient
} from '../../aidbox-types'

interface DomainResource {}

interface Resource<T = string> {
    resourceType: T;
}

interface MyPatient extends DomainResource, Resource<"Patient"> {
    name: HumanName
}

const patient = {
    name: 123,
    resourceType: "Patient" as const
}

const valid = (patient: Patient) => {
    console.log(patient);
}

valid(patient);



//
// type ResourceTypeMap = {
//     Patient: Patient;
// }
//
// export type ResourceType = keyof ResourceTypeMap;
// export type Resource<T extends ResourceType | void = void> = T extends ResourceType ? ResourceTypeMap[T] : ResourceTypeMap;
//
//


// export type Reference<T extends ResourceType> = {
//     id: string;
//     resourceType: T;
//     display?: string;
// };

// export function createReference<T extends ResourceType>(resourceType: T, id: string): Reference<T> {
//     return { resourceType, id };
// }