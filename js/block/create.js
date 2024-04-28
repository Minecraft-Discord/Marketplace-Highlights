// js/script.js
function addBlock(namespaceId) {
    const container = document.getElementById('addBlockContainer');
    const namespace = document.getElementById(namespaceId).value;

    // Create a box
    const box = document.createElement('div');
    box.className = 'box';

    // Create the top section
    const topSection = document.createElement('div');
    topSection.className = 'top-section';
    topSection.onclick = function() {
        toggleExpanded(this);
    };

    // Create the expand button
    const expandBtn = document.createElement('span');
    expandBtn.className = 'expand-btn';
    expandBtn.innerHTML = '▼';

    // Create the namespace-item span
    const namespaceItem = document.createElement('span');
    namespaceItem.className = 'namespace-item';
    namespaceItem.textContent = namespace + ':ItemName';

// ------------ Creation Section ------------ \\

    // Create the item-name section
    const itemNameSection = createSection();    

    // Create the itemName input field
    const itemName = createTextBox(itemNameSection, 'itemName', 'Item', 'Item Name:', 'Enter item name...');
    itemName.oninput = function() {
        updateItemName(this, namespaceItem, itemNameText);
    };

    // Create the dropdown select element
    createDropdown(itemNameSection, 'dropdown', 'Category:', component.blocks.catagories);

    // Create the dropdown select element
    createDropdown(itemNameSection, 'dropdown', 'Material:', component.blocks.materials);
 
// ------------ Creation Section End ------------ \\     

    // Create the bottomSection section
    const bottomSection = createSection();

    

    // Create the item-name text span
    const itemNameText = document.createElement('span');
    itemNameText.className = 'item-name-text';
    itemNameText.textContent = 'ItemName';

    // Create the close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function() {
        removeItem(this);
    };

    // Append the elements to the top section
    topSection.appendChild(expandBtn);
    topSection.appendChild(namespaceItem);
    topSection.appendChild(itemNameText);
    topSection.appendChild(closeBtn);

    // Create the expanded section
    const expandedSection = document.createElement('div');
    expandedSection.className = 'expanded-section';

    // Append the component button container to the expanded section
    expandedSection.appendChild(itemNameSection);
        

    // Append the sections to the box
    box.appendChild(topSection);
    box.appendChild(expandedSection);

    // Append the box to the container
    container.insertBefore(box, container.lastElementChild);
}



function toggleExpanded(element) {
    const box = element.closest('.box');
    const expandedSection = box.querySelector('.expanded-section');
    const expandBtn = box.querySelector('.expand-btn');

    if (expandedSection.style.display === 'none' || expandedSection.style.display === '') {
        expandedSection.style.display = 'block';
        expandBtn.innerHTML = '▲'; // Change the icon to up arrow when expanded
    } else {
        expandedSection.style.display = 'none';
        expandBtn.innerHTML = '▼'; // Change the icon to down arrow when collapsed
    }
}

function removeItem(element) {
    const box = element.closest('.box');
    box.parentNode.removeChild(box);
}


function updateItemName(itemNameInput, namespaceItem, itemNameText) {
    let newName = itemNameInput.value;
    let itemName = itemNameInput.value;

    // Replace spaces with underscores
    newName = newName.replace(/ /g, '_').toLowerCase();

    // If the item name is empty, use the default item name
    if (newName.trim() === '') {
        newName = 'ItemName';
        itemName = 'ItemName';
    }

    const namespace = namespaceItem.textContent.split(':')[0];
    namespaceItem.textContent = newName;
    itemNameText.textContent = itemName;
}
