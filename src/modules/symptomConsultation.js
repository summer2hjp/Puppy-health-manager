const symptomDecisionTree = {
    vomit: {
        level: '紧急',
        advice: '若持续呕吐超过 6 小时、精神萎靡或无法进水，请立即前往医院急诊。'
    },
    cough: {
        level: '中度关注',
        advice: '先观察 24 小时，保持温暖并记录频率；若伴随呼吸急促请尽快就医。'
    },
    itch: {
        level: '观察',
        advice: '排查过敏源，避免频繁抓挠；若出现破皮渗液建议线上问诊或线下检查。'
    }
};

function renderConsultationList(records, listElement) {
    listElement.innerHTML = '';
    if (!records.length) {
        listElement.innerHTML = '<li class="card">暂无在线问诊记录</li>';
        return;
    }

    records.forEach((record) => {
        const item = document.createElement('li');
        item.className = 'card';
        const fileText = record.files.length ? record.files.join(', ') : '未上传';
        item.textContent = `问诊升级时间: ${record.createdAt} | 上传资料: ${fileText}`;
        listElement.appendChild(item);
    });
}

export function initSymptomConsultation({ storage, getAccountId }) {
    const symptomForm = document.getElementById('symptom-form');
    const result = document.getElementById('symptom-result');
    const consultForm = document.getElementById('consult-form');
    const consultStatus = document.getElementById('consult-status');
    const consultations = document.getElementById('consultation-list');
    const fileInput = document.getElementById('medical-records');

    function refreshConsultations() {
        const records = storage.read(getAccountId(), 'consultations', []);
        renderConsultationList(records, consultations);
    }

    symptomForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const key = document.getElementById('symptom-input').value;
        const decision = symptomDecisionTree[key];

        if (!decision) {
            result.textContent = '未匹配到对应症状，请尽快联系执业兽医进行专业诊断。';
            return;
        }

        result.innerHTML = `
            <p><strong>风险等级：</strong>${decision.level}</p>
            <p><strong>建议：</strong>${decision.advice}</p>
            <p class="muted">免责声明：此结果用于健康管理参考，不构成医学诊断结论。</p>
        `;
    });

    consultForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const accountId = getAccountId();
        const records = storage.read(accountId, 'consultations', []);
        const files = Array.from(fileInput.files || []).map((file) => file.name);
        const record = {
            createdAt: new Date().toLocaleString('zh-CN'),
            files
        };

        records.unshift(record);
        storage.write(accountId, 'consultations', records);
        consultStatus.textContent = `已提交在线问诊请求，资料文件数量：${files.length}`;
        consultForm.reset();
        refreshConsultations();
    });

    document.getElementById('account-id').addEventListener('change', refreshConsultations);
    refreshConsultations();
}
