async function getData(id) {
  return fetch(`http://localhost:4508/data${id ? `?id=${id}` : ''}`).then(res => res.json())
}

async function createData() {
  return fetch(`http://localhost:4508/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      date: date.value,
      time: time.value,
      amount: amount.value,
      summary: summary.value,
      memo: memo.value,
    })
  })
}

async function updateData(id) {
  return fetch(`http://localhost:4508/data/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      date: date.value,
      time: time.value,
      amount: amount.value,
      summary: summary.value,
      memo: memo.value,
    })
  })
}

async function deleteData(id) {
  return fetch(`http://localhost:4508/data/${id}`, {
    method: "DELETE",
  })
}

function setModalData(data) {
  const modal = document.querySelector('.modal'),
        btnCreate = modal.querySelector('.create'),
        btnUpdate = modal.querySelector('.confirm');

  modal.dataset.id = data?.id || 0
  if (!+modal.dataset.id) {
    btnCreate.style.display = 'inline-block';
    btnUpdate.style.display = 'none';
  } else {
    btnUpdate.style.display = 'inline-block';
    btnCreate.style.display = 'none';
  }

  console.log(new Date().toLocaleString())
  date.value = data?.date.split('T')[0] || new Date().toLocaleDateString().split('.').join('').split(' ').join('-')
  time.value = data?.time || new Date().toTimeString().split(' ')[0]
  amount.value = data?.amount || 0
  summary.value = data?.summary || ''
  memo.value = data?.memo || ''
}

function createGrid(data) {
  const grid = document.querySelector('.grid')
  grid.innerHTML = ''
  grid.insertAdjacentHTML('beforeend', `
    <div class="grid__row --header">
      <div class="grid__data --header">date</div>  
      <div class="grid__data --header">amount</div>  
      <div class="grid__data --header">summary</div>  
      <div class="grid__data --header">memo</div>  
      <div class="grid__data --header">action</div>  
    </div>
  `)
  data.map(datum => {
    return `
      <div class="grid__row" data-id="${datum.id}">
        <div class="grid__data">${datum.date.split('T')[0]}<br />${datum.time}</div>  
        <div class="grid__data">${datum.amount}</div>  
        <div class="grid__data">${datum.summary}</div>  
        <div class="grid__data">${datum.memo}</div>
        <div class="grid__data">
          <button class="btn delete">삭제</div>
        </div>
      </div>
    `
  }).forEach(html => {
    grid.insertAdjacentHTML('beforeend', html)
  })
}

async function initGrid() {
  const data = await getData()
  createGrid(data)
}
document.addEventListener('DOMContentLoaded', async () => {
  await initGrid()

  const grid = document.querySelector('.grid')
  const modal = document.querySelector('.modal')
  modal.addEventListener('click', async e => {
    if (e.target.classList.contains('cancel')) {
      modal.close()
    }
    if (e.target.classList.contains('confirm')) {
      await updateData(modal.dataset.id)
      await initGrid()
      modal.close()
    }
    if (e.target.classList.contains('create')) {
      await createData()
      await initGrid()
      modal.close()
    }
  })
  grid.addEventListener('click', async e => {
    if (e.target.classList.contains('delete')) {
      const id = e.target.closest('.grid__row:not(.--header)').dataset.id
      await deleteData(id)
      await initGrid()
    }
    if (e.target.classList.contains('grid__data')) {
      const id = e.target.closest('.grid__row:not(.--header)').dataset.id
      const [ data ] = await getData(id)
      setModalData(data)
      modal.showModal()
    }
  })
  const btnCreate = document.querySelector('.btn.create')

  btnCreate.addEventListener('click', e => {
    setModalData()
    modal.showModal()
  })
})