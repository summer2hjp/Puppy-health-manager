const INITIAL_BALANCE = 100;

function renderPosts(posts, listElement, updateStatus, storage, getAccountId, refresh) {
    listElement.innerHTML = '';
    if (!posts.length) {
        listElement.innerHTML = '<li class="card">暂无社区问题，欢迎发布第一个提问</li>';
        return;
    }

    posts.forEach((post) => {
        const item = document.createElement('li');
        item.className = 'card';

        const title = document.createElement('h4');
        title.textContent = `${post.title}（悬赏: ${post.reward}）`;

        const content = document.createElement('p');
        content.textContent = post.content;

        const actions = document.createElement('div');
        const rewardButton = document.createElement('button');
        rewardButton.type = 'button';
        rewardButton.className = 'secondary';
        rewardButton.textContent = '采纳回答并发放悬赏';
        rewardButton.disabled = post.reward === 0 || post.rewardSettled;

        rewardButton.addEventListener('click', () => {
            if (post.rewardSettled || post.reward === 0) {
                return;
            }
            const accountId = getAccountId();
            const wallet = storage.read(accountId, 'wallet', { balance: INITIAL_BALANCE });
            wallet.balance += post.reward;
            storage.write(accountId, 'wallet', wallet);

            const records = storage.read(accountId, 'posts', []);
            const target = records.find((record) => record.id === post.id);
            if (target) {
                target.rewardSettled = true;
                storage.write(accountId, 'posts', records);
                updateStatus(`问题《${post.title}》悬赏已发放给回答者，积分已入账。`);
                refresh();
            }
        });

        actions.appendChild(rewardButton);
        item.append(title, content, actions);
        listElement.appendChild(item);
    });
}

export function initCommunity({ storage, getAccountId }) {
    const form = document.getElementById('post-form');
    const status = document.getElementById('community-status');
    const postList = document.getElementById('post-list');
    const walletBalance = document.getElementById('wallet-balance');

    function updateStatus(text) {
        status.textContent = text;
    }

    function getWallet(accountId) {
        const wallet = storage.read(accountId, 'wallet', null);
        if (wallet) {
            return wallet;
        }
        const initialWallet = { balance: INITIAL_BALANCE };
        storage.write(accountId, 'wallet', initialWallet);
        return initialWallet;
    }

    function refresh() {
        const accountId = getAccountId();
        const wallet = getWallet(accountId);
        walletBalance.textContent = wallet.balance.toString();
        const posts = storage.read(accountId, 'posts', []);
        renderPosts(posts, postList, updateStatus, storage, getAccountId, refresh);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const accountId = getAccountId();
        const wallet = getWallet(accountId);
        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();
        const reward = Number(document.getElementById('post-reward').value || 0);

        if (reward > wallet.balance) {
            updateStatus('积分不足，无法发布该悬赏问题。');
            return;
        }

        wallet.balance -= reward;
        storage.write(accountId, 'wallet', wallet);

        const posts = storage.read(accountId, 'posts', []);
        posts.unshift({
            id: Date.now().toString(),
            title,
            content,
            reward,
            rewardSettled: false
        });
        storage.write(accountId, 'posts', posts);

        updateStatus(`问题已发布，已冻结悬赏积分：${reward}`);
        form.reset();
        refresh();
    });

    document.getElementById('account-id').addEventListener('change', refresh);
    refresh();
}
