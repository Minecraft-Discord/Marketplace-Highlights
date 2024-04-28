// js/script.js
function addItem(namespaceId) {
    const container = document.getElementById('itemContainer');
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

    // Create the item-name section
    const itemNameSection = createSection();    

    // Create the itemName input field
    const itemName = createTextBox(itemNameSection, 'itemName', 'Item', 'Item Name:', 'Enter item name...');
    itemName.oninput = function() {
        updateItemName(this, namespaceItem, itemNameText);
    };

    // Create the dropdown select element
    createDropdown(itemNameSection, 'dropdown', 'Category:', ["none", "construction", "nature", "equipment", "items"]);

    //Create item group box
    createTextBox(itemNameSection, 'group', '', 'Group:', 'itemGroup.name.blaze')
 
    //create hidden in commands checkbox
    createCheckBox(itemNameSection, 'hidden', 'hidden', 'Hidden in commands:', false)
    

    // Create the bottomSection section
    const bottomSection = createSection();
    
    // Create the component button container
    const componentBtnContainer = document.createElement('div');
    componentBtnContainer.className = 'component-btn-container';

    // Create the component button
    const componentBtn = document.createElement('span');
    componentBtn.className = 'component-btn';
    componentBtn.innerHTML = 'Add Component';
    componentBtn.style.marginTop = '10px';
    componentBtn.onclick = function() {
        addComponent(this);
    };

    // Append the component button to its container
    componentBtnContainer.appendChild(componentBtn);

    

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
    expandedSection.appendChild(componentBtnContainer); // Add the button container
        

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
    namespaceItem.textContent = namespace + ':' + newName;
    itemNameText.textContent = itemName;
}


function updateNamespace(namespaceId) {
    const namespaceInput = document.getElementById(namespaceId);
    let namespace = namespaceInput.value; // Get the current value
    const defaultNamespace = namespaceId; // Default namespace value

    // Replace all spaces with underscores
    namespace = namespace.replace(/ /g, '_');

    // If the namespace is empty or contains only underscores, use the default namespace
    if (namespace === '' || namespace === '_') {
        namespace = defaultNamespace;
    }

    namespaceInput.value = namespace; // Update the value in the input field

    const namespaceItems = document.querySelectorAll('.namespace-item');

    namespaceItems.forEach(function(namespaceItem) {
        const itemName = namespaceItem.textContent.split(':')[1];
        namespaceItem.textContent = namespace + ':' + itemName; // Use the updated input value
    });
}


function addComponent(button) {
    // Create a box for the component
    const box = document.createElement('div');
    box.className = 'box';

    // Create the top section for the component
    const topSection = document.createElement('div');
    topSection.className = 'top-section';
    topSection.onclick = function() {
        toggleExpanded(this);
    };

    // Create the expand button for the component
    const expandBtn = document.createElement('span');
    expandBtn.className = 'expand-btn';
    expandBtn.innerHTML = '▼';

    // Create the item-name section for the component
    const itemNameSection = createSection();
    
    // Create the itemName input field for the component
    const itemName = createTextBox(itemNameSection, 'itemName', 'Component', 'Component Name:', 'Enter component name...');

    // Create the dropdown select element for the component
    createDropdown(itemNameSection, 'dropdown', 'Category:', ["none", "construction", "nature", "equipment", "items"]);

    // Create item group box for the component
    createTextBox(itemNameSection, 'group', '', 'Group:', 'itemGroup.name.blaze')

    // Create hidden in commands checkbox for the component
    createCheckBox(itemNameSection, 'hidden', 'hidden', 'Hidden in commands:', false)

    // Create the item-name text span for the component
    const itemNameText = document.createElement('span');
    itemNameText.className = 'item-name-text';
    itemNameText.textContent = 'ComponentName';

    // Create the close button for the component
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function() {
        removeItem(this);
    };

    // Append the elements to the top section of the component
    topSection.appendChild(expandBtn);
    topSection.appendChild(itemNameText);
    topSection.appendChild(closeBtn);

    // Create the expanded section for the component
    const expandedSection = document.createElement('div');
    expandedSection.className = 'expanded-section';

    expandedSection.appendChild(itemNameSection);

    // Append the sections to the box for the component
    box.appendChild(topSection);
    box.appendChild(expandedSection);

    // Insert the box before the button
    button.parentNode.insertBefore(box, button);
}