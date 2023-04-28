import { Patient, Entity, EntityType } from '../../aidbox-cli-types'
import axios from 'axios';

async function getResource<T extends EntityType>(resourceType: T, resourceId: string): Promise<Entity<T>> {
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