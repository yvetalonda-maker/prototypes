function filterTable() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value.toLowerCase();
  const rows = document.querySelectorAll('#printersTable tbody tr');
  let visible = 0;

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const rowStatus = row.dataset.status;
    const matchesSearch = !search || text.includes(search);
    const matchesStatus = !status || rowStatus === status;

    if (matchesSearch && matchesStatus) {
      row.classList.remove('hidden');
      visible++;
    } else {
      row.classList.add('hidden');
    }
  });

  document.getElementById('resultCount').textContent =
    visible === rows.length
      ? `Showing ${visible} printers`
      : `Showing ${visible} of ${rows.length} printers`;
}

function showDialog(id) {
  document.getElementById(id).style.display = 'flex';
}

function hideDialog(id) {
  document.getElementById(id).style.display = 'none';
}

function showDeleteConfirm(name) {
  document.getElementById('delete-printer-name').textContent = name;
  showDialog('delete-dialog');
}
