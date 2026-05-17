import { createStorage } from './modules/storage.js';
import { initPetRecords } from './modules/petRecords.js';
import { initSymptomConsultation } from './modules/symptomConsultation.js';
import { initAppointments } from './modules/appointments.js';
import { initCommunity } from './modules/community.js';

const storage = createStorage(window.localStorage);

const accountInput = document.getElementById('account-id');

function getAccountId() {
    return (accountInput.value || 'demo-user').trim();
}

initPetRecords({ storage, getAccountId });
initSymptomConsultation({ storage, getAccountId });
initAppointments({ storage, getAccountId });
initCommunity({ storage, getAccountId });
