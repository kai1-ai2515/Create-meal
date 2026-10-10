(() => {
  const vocForm = document.getElementById('voc-submit-form');
  const vocCategory = document.getElementById('voc-category');
  const vocSubject = document.getElementById('voc-subject');
  const vocMessage = document.getElementById('voc-message');
  const vocCharacterCount = document.getElementById('voc-character-count');
  const vocSubmitButton = document.getElementById('voc-submit-btn');
  const vocSubmitMessage = document.getElementById('voc-submit-message');
  const myVocList = document.getElementById('my-voc-list');
  const vocAdminPage = document.getElementById('voc-admin-page');
  const closeVocAdminButton = document.getElementById('close-voc-admin-btn');
  const vocInboxTab = document.getElementById('voc-inbox-tab');
  const vocTrashTab = document.getElementById('voc-trash-tab');
  const vocSearch = document.getElementById('voc-search');
  const vocStatusFilter = document.getElementById('voc-status-filter');
  const vocRefreshButton = document.getElementById('voc-refresh-btn');
  const vocExportButton = document.getElementById('voc-export-btn');
  const vocTotalCount = document.getElementById('voc-total-count');
  const vocOpenCount = document.getElementById('voc-open-count');
  const vocUnhandledCount = document.getElementById('voc-unhandled-count');
  const vocInProgressCount = document.getElementById('voc-in-progress-count');
  const vocResolvedCount = document.getElementById('voc-resolved-count');
  const vocArchivedCount = document.getElementById('voc-archived-count');
  const vocAdminMessage = document.getElementById('voc-admin-message');
  const vocTableBody = document.getElementById('voc-table-body');
  const vocLogoutButton = document.getElementById('voc-logout-btn');
  const vocStorageKey = 'meal-planner-voc-messages';
  let currentView = 'inbox';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function formatDate(value) {
    return new Date(value).toLocaleString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('meal-planner-current-user') || 'null');
    } catch (error) {
      return null;
    }
  }

  function getVocMessages() {
    try {
      return JSON.parse(localStorage.getItem(vocStorageKey) || '[]');
    } catch (error) {
      console.warn('VOCデータを読み込めませんでした', error);
      return [];
    }
  }

  function saveVocMessages(messages) {
    localStorage.setItem(vocStorageKey, JSON.stringify(messages));
  }

  function renderSummary(items) {
    const inbox = items.filter((item) => !item.archivedAt);
    vocOpenCount.textContent = String(inbox.length);
    vocUnhandledCount.textContent = String(inbox.filter((item) => item.status === '未対応').length);
    vocInProgressCount.textContent = String(inbox.filter((item) => item.status === '対応中').length);
    vocResolvedCount.textContent = String(inbox.filter((item) => item.status === '対応済み').length);
    vocArchivedCount.textContent = String(items.length - inbox.length);
  }

  function toCsvCell(value) {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportVocCsv() {
    const user = getCurrentUser();
    if (!user || user.role !== 'developer') {
      vocAdminMessage.textContent = 'CSVの書き出しには開発者権限が必要です。';
      return;
    }

    const items = getVocMessages().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!items.length) {
      vocAdminMessage.textContent = '書き出すVOCがありません。';
      return;
    }

    const columns = [
      ['受信日時', 'createdAt'],
      ['メールアドレス', 'userEmail'],
      ['カテゴリ', 'category'],
      ['件名', 'subject'],
      ['内容', 'message'],
      ['対応状況', 'status'],
      ['ゴミ箱移動日時', 'archivedAt']
    ];
    const rows = [
      columns.map(([label]) => toCsvCell(label)).join(','),
      ...items.map((item) => columns.map(([, key]) => toCsvCell(item[key])).join(','))
    ];
    const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recipeta-voc-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    vocAdminMessage.textContent = `${items.length}件のVOCをCSVに書き出しました。`;
  }

  async function loadMine() {
    if (!myVocList) return;

    const user = getCurrentUser();
    if (!user) {
      myVocList.innerHTML = '<p class="empty-message">ログインしてください。</p>';
      return;
    }

    try {
      const data = getVocMessages()
        .filter((item) => item.userId === user.id && !item.archivedAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      if (!data.length) {
        myVocList.innerHTML = '<p class="empty-message">お問い合わせはまだありません。</p>';
        return;
      }

      myVocList.innerHTML = data.map((item) => `
        <article class="my-voc-item">
          <div class="my-voc-item-heading">
            <strong>${escapeHtml(item.subject)}</strong>
            <span class="voc-status-pill">${escapeHtml(item.status)}</span>
          </div>
          <time datetime="${escapeHtml(item.createdAt)}">${escapeHtml(formatDate(item.createdAt))} · ${escapeHtml(item.category)}</time>
          <p>${escapeHtml(item.message)}</p>
        </article>
      `).join('');
    } catch (error) {
      console.error('VOC履歴を取得できませんでした', error);
      myVocList.innerHTML = '<p class="empty-message">お問い合わせ履歴を読み込めませんでした。時間をおいて再度お試しください。</p>';
    }
  }

  async function submitVoc(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      vocSubmitMessage.textContent = 'ログインしてください。';
      return;
    }

    const subject = vocSubject.value.trim();
    const message = vocMessage.value.trim();
    if (!subject || !message) {
      vocSubmitMessage.textContent = '件名と内容を入力してください。';
      return;
    }

    vocSubmitButton.disabled = true;
    vocSubmitMessage.textContent = '送信しています...';
    try {
      const entries = getVocMessages();
      entries.unshift({
        id: `voc-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        userId: user.id,
        userEmail: user.email,
        category: vocCategory.value,
        subject,
        message,
        status: '未対応',
        createdAt: new Date().toISOString(),
        archivedAt: null
      });
      saveVocMessages(entries);
      vocForm.reset();
      vocCharacterCount.textContent = '0 / 4000';
      vocSubmitMessage.textContent = '送信しました。マイページから対応状況を確認できます。';
      await loadMine();
    } catch (error) {
      console.error('VOCを送信できませんでした', error);
      vocSubmitMessage.textContent = '送信できませんでした。時間をおいて再度お試しください。';
    } finally {
      vocSubmitButton.disabled = false;
    }
  }

  function setCurrentView(view) {
    currentView = view;
    const showingInbox = view === 'inbox';
    vocInboxTab.classList.toggle('is-active', showingInbox);
    vocInboxTab.setAttribute('aria-pressed', String(showingInbox));
    vocTrashTab.classList.toggle('is-active', !showingInbox);
    vocTrashTab.setAttribute('aria-pressed', String(!showingInbox));
    renderAdminList();
  }

  function renderRows(items) {
    if (!items.length) {
      vocTableBody.innerHTML = `<tr><td colspan="5" class="empty-message">${currentView === 'inbox' ? '受信箱にVOCはありません。' : 'ゴミ箱は空です。'}</td></tr>`;
      return;
    }

    vocTableBody.innerHTML = items.map((item) => {
      const actions = currentView === 'inbox'
        ? `<select data-voc-status="${item.id}" aria-label="${escapeHtml(item.subject)}の対応状況">
             ${['未対応', '対応中', '対応済み'].map((status) => `<option value="${status}" ${item.status === status ? 'selected' : ''}>${status}</option>`).join('')}
           </select>
           <label><input type="checkbox" data-voc-archive="${item.id}" /><span>修正後にゴミ箱へ</span></label>`
        : `<button type="button" class="secondary-btn" data-voc-restore="${item.id}">受信箱に戻す</button>
           <button type="button" class="danger-btn" data-voc-delete="${item.id}">完全削除</button>`;
      return `
        <tr>
          <td class="voc-date-cell">${escapeHtml(formatDate(item.createdAt))}</td>
          <td class="voc-user-cell">${escapeHtml(item.userEmail)}</td>
          <td class="voc-content-cell"><strong>${escapeHtml(item.subject)}</strong><span class="voc-status-pill">${escapeHtml(item.category)}</span><p>${escapeHtml(item.message)}</p></td>
          <td><span class="voc-status-pill">${escapeHtml(item.status)}</span></td>
          <td class="voc-row-actions">${actions}</td>
        </tr>`;
    }).join('');
  }

  async function renderAdminList() {
    if (!vocAdminPage || vocAdminPage.hidden || !vocTableBody) return;

    const user = getCurrentUser();
    if (!user || user.role !== 'developer') {
      vocTableBody.innerHTML = '<tr><td colspan="5" class="empty-message">開発者ログインでのみVOC管理を利用できます。</td></tr>';
      vocTotalCount.textContent = '0件';
      vocAdminMessage.textContent = '開発者権限が必要です。';
      return;
    }

    vocAdminMessage.textContent = 'VOCを読み込んでいます...';
    try {
      const allMessages = getVocMessages();
      renderSummary(allMessages);
      const data = allMessages
        .filter((item) => currentView === 'inbox' ? !item.archivedAt : !!item.archivedAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const search = vocSearch.value.trim().toLocaleLowerCase();
      const filtered = search
        ? data.filter((item) => [item.userEmail, item.subject, item.message, item.category].some((value) => String(value).toLocaleLowerCase().includes(search)))
        : data;

      const statusFilter = vocStatusFilter.value;
      const filteredByStatus = statusFilter === 'all'
        ? filtered
        : filtered.filter((item) => item.status === statusFilter);

      vocTotalCount.textContent = `${filteredByStatus.length}件`;
      renderRows(filteredByStatus);
      vocAdminMessage.textContent = '';
    } catch (error) {
      console.error('VOC一覧を取得できませんでした', error);
      vocTotalCount.textContent = '0件';
      vocTableBody.innerHTML = '<tr><td colspan="5" class="empty-message">一覧を読み込めませんでした。</td></tr>';
      vocAdminMessage.textContent = 'VOC一覧を取得できませんでした。';
    }
  }

  async function updateVoc(id, changes) {
    const items = getVocMessages().map((item) => item.id === id ? { ...item, ...changes } : item);
    saveVocMessages(items);
    await renderAdminList();
  }

  vocForm.addEventListener('submit', submitVoc);
  vocMessage.addEventListener('input', () => {
    vocCharacterCount.textContent = `${vocMessage.value.length} / 4000`;
  });
  vocInboxTab.addEventListener('click', () => setCurrentView('inbox'));
  vocTrashTab.addEventListener('click', () => setCurrentView('trash'));
  vocSearch.addEventListener('input', renderAdminList);
  vocStatusFilter.addEventListener('change', renderAdminList);
  vocRefreshButton.addEventListener('click', renderAdminList);
  vocExportButton.addEventListener('click', exportVocCsv);
  closeVocAdminButton.addEventListener('click', () => {
    vocAdminPage.hidden = true;
    document.querySelector('.content').hidden = false;
  });
  vocLogoutButton.addEventListener('click', async () => {
    try {
      if (window.mealSupabaseClient) {
        const { error } = await window.mealSupabaseClient.auth.signOut();
        if (error) throw error;
      }
      localStorage.removeItem('meal-planner-current-user');
      sessionStorage.removeItem('meal-planner-developer-password');
      window.location.reload();
    } catch (error) {
      console.error('開発者ログアウトに失敗しました', error);
      vocAdminMessage.textContent = error.message || 'ログアウトできませんでした。時間をおいて再度お試しください。';
    }
  });

  vocTableBody.addEventListener('change', async (event) => {
    const statusSelect = event.target.closest('[data-voc-status]');
    const archiveCheckbox = event.target.closest('[data-voc-archive]');
    try {
      if (statusSelect) await updateVoc(statusSelect.dataset.vocStatus, { status: statusSelect.value });
      if (archiveCheckbox && archiveCheckbox.checked) {
        await updateVoc(archiveCheckbox.dataset.vocArchive, {
          status: '対応済み',
          archivedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      vocAdminMessage.textContent = error.message || 'VOCを更新できませんでした。';
      await renderAdminList();
    }
  });

  vocTableBody.addEventListener('click', async (event) => {
    const restoreButton = event.target.closest('[data-voc-restore]');
    const deleteButton = event.target.closest('[data-voc-delete]');
    try {
      if (restoreButton) await updateVoc(restoreButton.dataset.vocRestore, { archivedAt: null, status: '未対応' });
      if (deleteButton && window.confirm('このVOCを完全に削除しますか？この操作は取り消せません。')) {
        const items = getVocMessages().filter((item) => item.id !== deleteButton.dataset.vocDelete);
        saveVocMessages(items);
        await renderAdminList();
      }
    } catch (error) {
      vocAdminMessage.textContent = error.message || 'VOCを処理できませんでした。';
      await renderAdminList();
    }
  });

  window.vocManager = { loadMine, loadAdmin: renderAdminList };
})();