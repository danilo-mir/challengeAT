let selectedItem = null;
let selectedItems = [];
let currentAssetToAdd = null;

// Verify user's assets from database
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have user assets from the server
    if (typeof userAssets !== 'undefined' && userAssets.length > 0) {
        // Use assets from the server
        selectedItems = userAssets;
        updateTable();
    } else {
        // Fallback to localStorage if no server data is available
        const savedItems = localStorage.getItem('selectedItems');
        if (savedItems) {
            selectedItems = JSON.parse(savedItems);
            updateTable();
        }
    }
    checkEmptyTable();

    // Setup modal event listeners
    setupModalListeners();
});

function setupModalListeners() {
    // Get modal elements
    const modal = document.getElementById('parametersModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeButton = modal.querySelector('.close-button');
    const form = document.getElementById('parametersForm');
    const cancelButton = modal.querySelector('.cancel-btn');

    // Close modal when clicking on X button
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking on Cancel button
    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        // If the click is on the modal background (not on modal content)
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (currentAssetToAdd) {
            const upperTunnel = document.getElementById('upperTunnel').value;
            const lowerTunnel = document.getElementById('lowerTunnel').value;
            const checkPeriod = document.getElementById('checkPeriod').value;

            // Add the item with parameters
            selectedItems.push({
                id: currentAssetToAdd.id,
                name: currentAssetToAdd.name,
                upperTunnel: upperTunnel,
                lowerTunnel: lowerTunnel,
                checkPeriod: checkPeriod
            });

            saveItemsToServer();
            updateTable();

            // Reset and close modal
            form.reset();
            modal.style.display = 'none';
            currentAssetToAdd = null;
        }
    });
}
function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-content");
    let arrow = document.getElementById("arrow");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        arrow.classList.remove("arrow-up");
    } else {
        dropdown.style.display = "block";
        arrow.classList.add("arrow-up");
    }
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
        // Show modal for parameter input
        showParametersModal(selectedItem);
    } else {
        // Asset already added, show notification
        alert(`O ativo ${selectedItem.name} já está na sua lista de monitoramento.`);
    }

    // Close dropdown
    document.getElementById("dropdown-content").style.display = "none";
    document.getElementById("arrow").classList.remove("arrow-up");
}

function showParametersModal(item) {
    // Set current asset being added
    currentAssetToAdd = item;

    // Update asset name in modal
    document.getElementById('assetName').textContent = item.name;

    // Reset form if it has previous values
    document.getElementById('parametersForm').reset();

    // Show modal
    document.getElementById('parametersModal').style.display = 'block';
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
        upperTunnelCell.textContent = item.upperTunnel;
        row.appendChild(upperTunnelCell);

        const lowerTunnelCell = document.createElement('td');
        lowerTunnelCell.textContent = item.lowerTunnel;
        row.appendChild(lowerTunnelCell);

        const periodCell = document.createElement('td');
        periodCell.textContent = item.checkPeriod;
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
    saveItemsToServer();
    updateTable();
}

function saveItemsToServer() {
    // Send the selected items to the server
    fetch('/save-assets/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            assets: selectedItems
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error saving assets:', data.error);
        }
    })
    .catch(error => {
        console.error('Error saving assets:', error);
    });
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