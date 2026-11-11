const API_URL = '/api/barang';
const form = document.querySelector('#barang-form');
const list = document.querySelector('#barang-list');
const itemId = document.querySelector('#barang-id');
const nameInput = document.querySelector('#nama_barang');
const quantityInput = document.querySelector('#jumlah');
const priceInput = document.querySelector('#harga');
const formTitle = document.querySelector('#form-title');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const message = document.querySelector('#form-message');

let inventory = [];

const currency = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const numberFormat = new Intl.NumberFormat('id-ID');

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function updateSummary() {
  const totalUnits = inventory.reduce((sum, item) => sum + item.jumlah, 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.jumlah * Number(item.harga), 0);
  document.querySelector('#total-item').textContent = numberFormat.format(inventory.length);
  document.querySelector('#total-unit').textContent = numberFormat.format(totalUnits);
  document.querySelector('#total-value').textContent = currency.format(totalValue);
}

function renderItems() {
  list.replaceChildren();
  if (inventory.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4" class="empty-state">Belum ada barang tersimpan.</td>';
    list.append(row);
    updateSummary();
    return;
  }

  inventory.forEach((item) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const quantityCell = document.createElement('td');
    const priceCell = document.createElement('td');
    const actionCell = document.createElement('td');
    const actions = document.createElement('div');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    nameCell.textContent = item.nama_barang;
    quantityCell.textContent = numberFormat.format(item.jumlah);
    priceCell.textContent = currency.format(Number(item.harga));
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Hapus';
    editButton.className = 'action-button';
    deleteButton.className = 'action-button delete';
    editButton.type = 'button';
    deleteButton.type = 'button';
    editButton.addEventListener('click', () => startEdit(item));
    deleteButton.addEventListener('click', () => deleteItem(item.id, item.nama_barang));
    actions.className = 'action-group';
    actions.append(editButton, deleteButton);
    actionCell.append(actions);
    row.append(nameCell, quantityCell, priceCell, actionCell);
    list.append(row);
  });
  updateSummary();
}

async function loadItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Gagal memuat data.');
    inventory = await response.json();
    renderItems();
  } catch (error) {
    list.innerHTML = '<tr><td colspan="4" class="empty-state">Server belum terhubung.</td></tr>';
    showMessage(error.message, true);
  }
}

function resetForm() {
  form.reset();
  itemId.value = '';
  formTitle.textContent = 'Tambah barang';
  submitButton.textContent = 'Simpan barang';
  cancelButton.classList.add('hidden');
  showMessage('');
}

function startEdit(item) {
  itemId.value = item.id;
  nameInput.value = item.nama_barang;
  quantityInput.value = item.jumlah;
  priceInput.value = item.harga;
  formTitle.textContent = 'Edit barang';
  submitButton.textContent = 'Simpan perubahan';
  cancelButton.classList.remove('hidden');
  nameInput.focus();
}

async function saveItem(event) {
  event.preventDefault();
  submitButton.disabled = true;
  const id = itemId.value;
  const payload = {
    nama_barang: nameInput.value,
    jumlah: Number(quantityInput.value),
    harga: Number(priceInput.value)
  };

  try {
    const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menyimpan barang.');
    resetForm();
    await loadItems();
    showMessage(id ? 'Perubahan berhasil disimpan.' : 'Barang berhasil ditambahkan.');
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
}

async function deleteItem(id, name) {
  if (!window.confirm(`Hapus barang "${name}"?`)) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const result = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(result?.message || 'Gagal menghapus barang.');
    await loadItems();
    showMessage('Barang berhasil dihapus.');
  } catch (error) {
    showMessage(error.message, true);
  }
}

form.addEventListener('submit', saveItem);
cancelButton.addEventListener('click', resetForm);
loadItems();
