function renderPetList(pets, listElement) {
    listElement.innerHTML = '';
    if (!pets.length) {
        listElement.innerHTML = '<li class="card">暂无活跃宠物档案</li>';
        return;
    }

    pets.forEach((pet) => {
        const item = document.createElement('li');
        item.className = 'card';
        item.textContent = `${pet.name} | ${pet.species} | ${pet.breed} | 出生: ${pet.birthDate} | 疫苗: ${pet.vaccinationStatus}`;
        listElement.appendChild(item);
    });
}

export function initPetRecords({ storage, getAccountId }) {
    const form = document.getElementById('pet-form');
    const list = document.getElementById('pet-list');
    const status = document.getElementById('pet-status');

    function refresh() {
        const pets = storage.read(getAccountId(), 'pets', []);
        renderPetList(pets, list);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const pet = {
            id: Date.now().toString(),
            name: (formData.get('name') || '').toString().trim(),
            species: formData.get('species'),
            breed: (formData.get('breed') || '').toString().trim(),
            birthDate: formData.get('birthDate'),
            vaccinationStatus: formData.get('vaccinationStatus')
        };

        const accountId = getAccountId();
        const pets = storage.read(accountId, 'pets', []);
        pets.push(pet);
        storage.write(accountId, 'pets', pets);

        form.reset();
        status.textContent = `已为账号 ${accountId} 添加宠物档案：${pet.name}`;
        refresh();
    });

    document.getElementById('account-id').addEventListener('change', refresh);
    refresh();
}
