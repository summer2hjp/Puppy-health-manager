const clinicsByArea = {
    beijing: [
        { name: '朝阳宠物诊所', slots: ['2026-05-18 10:00', '2026-05-18 14:00'] },
        { name: '海淀爱宠医院', slots: ['2026-05-19 09:30', '2026-05-19 16:00'] }
    ],
    shanghai: [
        { name: '浦东安心宠物医院', slots: ['2026-05-18 11:00', '2026-05-18 15:30'] },
        { name: '徐汇萌宠门诊', slots: ['2026-05-20 10:30', '2026-05-20 17:00'] }
    ]
};

function populateClinics(area, clinicSelect) {
    clinicSelect.innerHTML = '<option value="">请选择诊所</option>';
    const clinics = clinicsByArea[area] || [];
    clinics.forEach((clinic) => {
        const option = document.createElement('option');
        option.value = clinic.name;
        option.textContent = clinic.name;
        clinicSelect.appendChild(option);
    });
}

function populateSlots(area, clinicName, slotSelect) {
    slotSelect.innerHTML = '<option value="">请选择时段</option>';
    const clinic = (clinicsByArea[area] || []).find((item) => item.name === clinicName);
    const slots = clinic ? clinic.slots : [];

    slots.forEach((slot) => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        slotSelect.appendChild(option);
    });
}

function renderAppointments(records, listElement) {
    listElement.innerHTML = '';
    if (!records.length) {
        listElement.innerHTML = '<li class="card">暂无预约记录</li>';
        return;
    }

    records.forEach((record) => {
        const item = document.createElement('li');
        item.className = 'card';
        item.textContent = `${record.areaLabel} | ${record.clinic} | ${record.slot} | 状态: ${record.status}`;
        listElement.appendChild(item);
    });
}

export function initAppointments({ storage, getAccountId }) {
    const area = document.getElementById('area');
    const clinic = document.getElementById('clinic');
    const slot = document.getElementById('slot');
    const form = document.getElementById('appointment-form');
    const status = document.getElementById('appointment-status');
    const list = document.getElementById('appointment-list');

    function refresh() {
        const records = storage.read(getAccountId(), 'appointments', []);
        renderAppointments(records, list);
    }

    area.addEventListener('change', () => {
        populateClinics(area.value, clinic);
        slot.innerHTML = '<option value="">请先选择诊所</option>';
    });

    clinic.addEventListener('change', () => {
        populateSlots(area.value, clinic.value, slot);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const accountId = getAccountId();
        const records = storage.read(accountId, 'appointments', []);
        const newRecord = {
            area: area.value,
            areaLabel: area.options[area.selectedIndex].text,
            clinic: clinic.value,
            slot: slot.value,
            status: '已确认'
        };

        records.unshift(newRecord);
        storage.write(accountId, 'appointments', records);
        status.textContent = `预约成功：${newRecord.clinic} - ${newRecord.slot}（确认通知已发送）`;
        form.reset();
        clinic.innerHTML = '<option value="">请先选择区域</option>';
        slot.innerHTML = '<option value="">请先选择诊所</option>';
        refresh();
    });

    document.getElementById('account-id').addEventListener('change', refresh);
    refresh();
}
