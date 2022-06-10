import { Patient, Organization, Location } from '../../aidbox-types'
import axios from 'axios';

type ResourceTypeMap = {
    Patient: Patient;
    Location: Location;
    Organization: Organization;
}

export type ResourceType = keyof ResourceTypeMap;
export type Resource<T extends ResourceType | void = void> = T extends ResourceType ? ResourceTypeMap[T] : ResourceTypeMap;

async function getResource<T extends ResourceType>(resourceType: T, resourceId: string): Promise<Resource<T>> {
    const client = axios.create({
        baseURL: 'http://localhost:8888',
        auth: { username: 'root', password: 'secret' },
    });

    const { data: resource } = await client.request({
        url: `/${resourceType}/${resourceId}`,
    });

    return resource;
}

const usePatient = (patient: Patient) => {
    console.log(patient);
};

const retrievePatient = async (id: string) => {
    const patient = await getResource("Patient", id);
    usePatient(patient);
}

retrievePatient("gena-razmakhnin");