// js/utils.js
function createSection(){
    const section = document.createElement('div');
    section.className = 'item-name-section';

    // Add CSS to align items at the top
    section.style.alignItems = 'flex-start';

    return section;
}

function createTextBox(section, id, value, label, placeholder){
    // Create the item-name label
    const itemNameLabel = createTextLabel(id, label);

    // Create the itemName input field
    const itemName = document.createElement('input');
    itemName.type = 'text';
    itemName.id = id;
    itemName.placeholder = placeholder;
    itemName.value = value;

    // Apply CSS to set the input field size
    itemName.style.width = '150px'; // Adjust the width as needed
    itemName.style.maxWidth = '200px'; // Set max width to limit growth

    section.appendChild(itemNameLabel);
    section.appendChild(itemName);

    return itemName;
}

function createDropdown(section, id, label, dropdownOptions){
    // Create the item-name label
    const itemNameLabel = createTextLabel(id, label);

     // Create the dropdown select element
     const dropdown = document.createElement('select');
     dropdown.id = id;
 
     // Create options for the dropdown
     const options = dropdownOptions;
 
     options.forEach(option => {
         const newOption = document.createElement('option');
         newOption.value = option
         newOption.textContent = option
 
         dropdown.appendChild(newOption)
     });

     section.appendChild(itemNameLabel);
     section.appendChild(dropdown); // Add the dropdown to the section

}

function createCheckBox(section, id, name, label, value){
    const itemNameLabel = createTextLabel(id, label);
    // Create a checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    

    // Set other attributes if needed
    checkbox.id = id; // Assign an ID for reference
    checkbox.name = name; // Assign a name for grouping checkboxes
    checkbox.value = value;

    // Apply CSS styles to the checkbox
    checkbox.style.marginRight = '400px'; 
    checkbox.style.marginLeft = '0px';
   

    section.appendChild(itemNameLabel);
     section.appendChild(checkbox);
}

function createTextLabel(id, label){
 // Create the item-name label
 const itemNameLabel = document.createElement('label');
 itemNameLabel.className = 'item-name-label'; // Add the CSS class
 itemNameLabel.htmlFor = id;
 itemNameLabel.textContent = label;

 return itemNameLabel;
}