let selectedItem = null;

let selectedItems = [];

// Verify local storage
document.addEventListener('DOMContentLoaded', function() {
    const savedItems = localStorage.getItem('selectedItems');
    if (savedItems) {
        selectedItems = JSON.parse(savedItems);
        updateTable();
    }
    checkEmptyTable();
});

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function filterItems() {
    let input = document.getElementById("searchBox");
    let filter = input.value.toUpperCase();
    let items = document.getElementById("items-container").getElementsByClassName("item-option");
    let noResults = document.getElementById("noResults");
    let visibleCount = 0;

    for (let i = 0; i < items.length; i++) {
        let txtValue = items[i].textContent || items[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
            visibleCount++;
        } else {
            items[i].style.display = "none";
        }
    }

    // No results message
    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }
}

function selectItem(item) {
    let items = document.getElementsByClassName("item-option");
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("selected");
    }

    item.classList.add("selected");


    selectedItem = {
        id: item.getAttribute("data-id"),
        name: item.innerText
    };

    if (!selectedItems.some(existingItem => existingItem.id === selectedItem.id)) {
        selectedItems.push({
            id: selectedItem.id,
            name: selectedItem.name,
            upperTunnel: '',
            lowerTunnel: '',
            checkPeriod: ''
        });

        saveItemsToLocalStorage();

        updateTable();
    }

    // Close dropdown
    document.getElementById("dropdown-content").style.display = "none";
}

function updateTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    selectedItems.forEach((item, index) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const upperTunnelCell = document.createElement('td');
        const upperTunnelInput = document.createElement('input');
        upperTunnelInput.type = 'text';
        upperTunnelInput.className = 'editable';
        upperTunnelInput.value = item.upperTunnel;
        upperTunnelInput.onchange = function() {
            item.upperTunnel = this.value;
            saveItemsToLocalStorage();
        };
        upperTunnelCell.appendChild(upperTunnelInput);
        row.appendChild(upperTunnelCell);

        const lowerTunnelCell = document.createElement('td');
        const lowerTunnelInput = document.createElement('input');
        lowerTunnelInput.type = 'text';
        lowerTunnelInput.className = 'editable';
        lowerTunnelInput.value = item.lowerTunnel;
        lowerTunnelInput.onchange = function() {
            item.lowerTunnel = this.value;
            saveItemsToLocalStorage();
        };
        lowerTunnelCell.appendChild(lowerTunnelInput);
        row.appendChild(lowerTunnelCell);

        const periodCell = document.createElement('td');
        const periodInput = document.createElement('input');
        periodInput.type = 'text';
        periodInput.className = 'editable';
        periodInput.value = item.checkPeriod;
        periodInput.onchange = function() {
            item.checkPeriod = this.value;
            saveItemsToLocalStorage();
        };
        periodCell.appendChild(periodInput);
        row.appendChild(periodCell);

        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Deletar';
        deleteButton.onclick = function() {
            deleteItem(index);
        };
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    checkEmptyTable();
}

function deleteItem(index) {
    selectedItems.splice(index, 1);
    saveItemsToLocalStorage();
    updateTable();
}

function saveItemsToLocalStorage() {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
}

function checkEmptyTable() {
    const emptyMessage = document.getElementById('empty-table-message');
    if (selectedItems.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}

// Close dropdown on click out of dropdown button
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button') && !event.target.matches('.arrow') &&
        !event.target.matches('.dropdown-content') && !event.target.matches('.search-box') &&
        !event.target.matches('.item-option')) {
        let dropdown = document.getElementById("dropdown-content");
        let arrow = document.getElementById("arrow");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
            arrow.classList.remove("arrow-up");
        }
    }
}