// Check if we're on the item detail page
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

// DOM elements
const addItemBtn = document.getElementById("add-item-btn");
const editItemsBtn = document.getElementById("edit-items-btn");
const itemModal = document.getElementById("item-modal");
const closeModal = document.querySelector(".close");
const itemForm = document.getElementById("item-form");
const modalTitle = document.getElementById("modal-title");
const itemImageFile = document.getElementById("item-image-file");
const langEnBtn = document.getElementById("lang-en");
const langArBtn = document.getElementById("lang-ar");
const headerTitle = document.getElementById("header-title");
const currencySelect = document.getElementById("currency-select");

// State
let isEditMode = false;
let currentItem = null;
let currentLanguage = "en"; // Default language
let currentCategory = "all"; // Default category
let currentCurrency = "USD"; // Default currency

// Currency exchange rate (USD to YER)
const exchangeRates = {
  USD: 1,
  YER: 240, // 1 USD = 240 YER (approximate rate)
};

// Language translations
const translations = {
  en: {
    pageTitle: "Restaurant Digital Menu",
    editItems: "Edit Items",
    home: "Home",
    addItem: "Add New Item",
    addItemModal: "Add New Menu Item",
    editItemModal: "Edit Menu Item",
    nameLabel: "Name:",
    descriptionLabel: "Description:",
    priceLabel: "Price:",
    categoryLabel: "Category:",
    imageLabel: "Image:",
    imageUrlLabel: "Image URL (optional):",
    uploadImageText: "Upload an image from your computer",
    imageUrlText: "Or enter a URL to an online image",
    saveItem: "Save Item",
    finishEditing: "Finish Editing",
    item: "Item:",
    price: "Price:",
    edit: "Edit",
    delete: "Delete",
    backToMenu: "Back to Menu",
    itemNotFound: "Item Not Found",
    itemNotFoundMessage: "Sorry, the item you're looking for doesn't exist.",
    allItems: "All Items",
    lunch: "LUNCH",
    breakfast: "BREAKFAST",
    dinner: "DINNER",
    drinks: "DRINKS",
  },
  ar: {
    pageTitle: "قائمة المطعم الرقمية",
    editItems: "تعديل العناصر",
    home: "الرئيسية",
    addItem: "إضافة عنصر جديد",
    addItemModal: "إضافة عنصر جديد إلى القائمة",
    editItemModal: "تعديل عنصر القائمة",
    nameLabel: "الاسم:",
    descriptionLabel: "الوصف:",
    priceLabel: "السعر:",
    categoryLabel: "الفئة:",
    imageLabel: "الصورة:",
    imageUrlLabel: "رابط الصورة (اختياري):",
    uploadImageText: "تحميل صورة من جهاز الكمبيوتر",
    imageUrlText: "أو أدخل رابطًا لصورة على الإنترنت",
    saveItem: "حفظ العنصر",
    finishEditing: "إنهاء التحرير",
    item: "العنصر:",
    price: "السعر:",
    edit: "تعديل",
    delete: "حذف",
    backToMenu: "العودة إلى القائمة",
    itemNotFound: "العنصر غير موجود",
    itemNotFoundMessage: "عذرًا، العنصر الذي تبحث عنه غير موجود.",
    allItems: "جميع العناصر",
    lunch: "الغداء",
    breakfast: "الإفطار",
    dinner: "العشاء",
    drinks: "المشروبات",
  },
};

// Database key for localStorage
const DB_KEY = "restaurantMenuItems";

// Initialize language from localStorage or default to English
function initLanguage() {
  const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
  currentLanguage = savedLanguage;
  updateLanguageUI();
  updateTexts();
}

// Initialize currency from localStorage or default to USD
function initCurrency() {
  const savedCurrency = localStorage.getItem("preferredCurrency") || "USD";
  currentCurrency = savedCurrency;
  if (currencySelect) {
    currencySelect.value = currentCurrency;
  }
}

// Update language UI (active button)
function updateLanguageUI() {
  if (langEnBtn && langArBtn) {
    if (currentLanguage === "en") {
      langEnBtn.classList.add("active");
      langArBtn.classList.remove("active");
    } else {
      langArBtn.classList.add("active");
      langEnBtn.classList.remove("active");
    }
  }

  // Update HTML lang attribute
  document.documentElement.lang = currentLanguage;

  // Update header title
  if (headerTitle) {
    headerTitle.textContent = translations[currentLanguage].pageTitle;
  }
}

// Update all texts on the page
function updateTexts() {
  if (editItemsBtn) {
    editItemsBtn.textContent = translations[currentLanguage].editItems;
  }

  if (addItemBtn) {
    addItemBtn.textContent = translations[currentLanguage].addItem;
  }

  // Update modal texts
  if (modalTitle) {
    modalTitle.textContent = isEditMode
      ? translations[currentLanguage].editItemModal
      : translations[currentLanguage].addItemModal;
  }

  // Update form labels
  const nameLabel = document.querySelector('label[for="item-name"]');
  const descriptionLabel = document.querySelector(
    'label[for="item-description"]'
  );
  const priceLabel = document.querySelector('label[for="item-price"]');
  const categoryLabel = document.querySelector('label[for="item-category"]');
  const imageLabel = document.querySelector('label[for="item-image-file"]');
  const imageUrlLabel = document.querySelector('label[for="item-image"]');
  const uploadImageText = document.querySelector('input[type="file"] + small');
  const imageUrlText = document.querySelectorAll("small")[1];
  const saveButton = document.querySelector('button[type="submit"]');

  if (nameLabel)
    nameLabel.textContent = translations[currentLanguage].nameLabel;
  if (descriptionLabel)
    descriptionLabel.textContent =
      translations[currentLanguage].descriptionLabel;
  if (priceLabel)
    priceLabel.textContent = translations[currentLanguage].priceLabel;
  if (categoryLabel)
    categoryLabel.textContent = translations[currentLanguage].categoryLabel;
  if (imageLabel)
    imageLabel.textContent = translations[currentLanguage].imageLabel;
  if (imageUrlLabel)
    imageUrlLabel.textContent = translations[currentLanguage].imageUrlLabel;
  if (uploadImageText)
    uploadImageText.textContent = translations[currentLanguage].uploadImageText;
  if (imageUrlText)
    imageUrlText.textContent = translations[currentLanguage].imageUrlText;
  if (saveButton)
    saveButton.textContent = translations[currentLanguage].saveItem;

  // Update edit mode button text
  if (editItemsBtn) {
    const body = document.body;
    if (body.classList.contains("edit-mode")) {
      editItemsBtn.textContent = translations[currentLanguage].finishEditing;
    } else {
      editItemsBtn.textContent = translations[currentLanguage].editItems;
    }
  }

  // Update category links
  updateCategoryLinks();
}

// Update category links text
function updateCategoryLinks() {
  const allItemsLink = document.querySelector(
    '[data-category="all"] .category-text-en'
  );
  const lunchLink = document.querySelector(
    '[data-category="lunch"] .category-text-en'
  );
  const breakfastLink = document.querySelector(
    '[data-category="breakfast"] .category-text-en'
  );
  const dinnerLink = document.querySelector(
    '[data-category="dinner"] .category-text-en'
  );
  const drinksLink = document.querySelector(
    '[data-category="drinks"] .category-text-en'
  );

  const allItemsLinkAr = document.querySelector(
    '[data-category="all"] .category-text-ar'
  );
  const lunchLinkAr = document.querySelector(
    '[data-category="lunch"] .category-text-ar'
  );
  const breakfastLinkAr = document.querySelector(
    '[data-category="breakfast"] .category-text-ar'
  );
  const dinnerLinkAr = document.querySelector(
    '[data-category="dinner"] .category-text-ar'
  );
  const drinksLinkAr = document.querySelector(
    '[data-category="drinks"] .category-text-ar'
  );

  if (allItemsLink)
    allItemsLink.textContent = translations[currentLanguage].allItems;
  if (lunchLink) lunchLink.textContent = translations[currentLanguage].lunch;
  if (breakfastLink)
    breakfastLink.textContent = translations[currentLanguage].breakfast;
  if (dinnerLink) dinnerLink.textContent = translations[currentLanguage].dinner;
  if (drinksLink) drinksLink.textContent = translations[currentLanguage].drinks;

  if (allItemsLinkAr)
    allItemsLinkAr.textContent = translations[currentLanguage].allItems;
  if (lunchLinkAr)
    lunchLinkAr.textContent = translations[currentLanguage].lunch;
  if (breakfastLinkAr)
    breakfastLinkAr.textContent = translations[currentLanguage].breakfast;
  if (dinnerLinkAr)
    dinnerLinkAr.textContent = translations[currentLanguage].dinner;
  if (drinksLinkAr)
    drinksLinkAr.textContent = translations[currentLanguage].drinks;
}

// Switch language
function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("preferredLanguage", lang);
  updateLanguageUI();
  updateTexts();
  loadMenuItems(); // Reload menu items to update translations
}

// Switch currency
function switchCurrency(currency) {
  currentCurrency = currency;
  localStorage.setItem("preferredCurrency", currency);
  loadMenuItems(); // Reload menu items to update prices
}

// Convert price based on selected currency
function convertPrice(priceUSD) {
  if (currentCurrency === "USD") {
    return priceUSD;
  } else if (currentCurrency === "YER") {
    return priceUSD * exchangeRates.YER;
  }
  return priceUSD;
}

// Format price based on currency
function formatPrice(price) {
  if (currentCurrency === "USD") {
    return `$${price.toFixed(2)}`;
  } else if (currentCurrency === "YER") {
    return `﷼${price.toFixed(0)}`;
  }
  return `$${price.toFixed(2)}`;
}

// Filter menu items by category
function filterMenuItems(items, category) {
  if (category === "all") {
    return items;
  }
  return items.filter((item) => item.category === category);
}

// Load menu items from database
async function loadMenuItems() {
  try {
    // Initialize database if needed
    initDatabase();

    // Get data from localStorage
    const storedData = localStorage.getItem(DB_KEY);
    let menuItems = [];

    if (storedData) {
      menuItems = JSON.parse(storedData);
    }

    // Filter items by current category
    const filteredItems = filterMenuItems(menuItems, currentCategory);

    const menuContainer = document.getElementById("menu-container");

    // Clear the container
    menuContainer.innerHTML = "";

    // Show message if no items in category
    if (filteredItems.length === 0) {
      menuContainer.innerHTML = `
        <div style="text-align: center; grid-column: 1 / -1; padding: 2rem; background: #f8f9fa; border-radius: 8px; margin: 1rem;">
          <h3>${
            currentLanguage === "ar"
              ? "لا توجد عناصر في هذه الفئة"
              : "No items in this category"
          }</h3>
          <p>${
            currentLanguage === "ar"
              ? 'انقر على "إضافة عنصر جديد" لإضافة عناصر إلى هذه الفئة'
              : 'Click "Add New Item" to add items to this category'
          }</p>
        </div>
      `;
      return;
    }

    filteredItems.forEach((item) => {
      const menuItemElement = createMenuItemElement(item);
      menuContainer.appendChild(menuItemElement);
    });
  } catch (error) {
    console.error("Error loading menu items:", error);
  }
}

// Create a menu item element
function createMenuItemElement(item) {
  const menuItem = document.createElement("div");
  menuItem.className = "menu-item";
  menuItem.dataset.id = item.id;

  // Create QR code data with item details
  const qrData = JSON.stringify({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
  });

  // Get translated item name and description
  const itemName =
    currentLanguage === "ar" && item.name_ar ? item.name_ar : item.name;
  const itemDescription =
    currentLanguage === "ar" && item.description_ar
      ? item.description_ar
      : item.description;

  // Convert and format price
  const convertedPrice = convertPrice(item.price);
  const formattedPrice = formatPrice(convertedPrice);

  // Get translated labels
  const itemLabel = translations[currentLanguage].item;
  const priceLabel = translations[currentLanguage].price;

  menuItem.innerHTML = `
        <img src="${item.image}" alt="${itemName}">
        <div class="item-details">
            <h2>${itemName}</h2>
            <p>${itemDescription}</p>
            <div class="price">${formattedPrice}</div>
            <div class="qr-code-container">
                <div id="qrcode-${item.id}"></div>
                <div class="qr-item-info">
                    <div class="info-row">
                        <span class="info-label">${itemLabel}</span>
                        <span class="info-value">${itemName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">${priceLabel}</span>
                        <span class="info-value">${formattedPrice}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="edit-actions">
            <button class="edit-btn" onclick="editItem('${item.id}')">${translations[currentLanguage].edit}</button>
            <button class="delete-btn" onclick="deleteItem('${item.id}')">${translations[currentLanguage].delete}</button>
        </div>
    `;

  // Generate QR code after the element is added to the DOM
  setTimeout(() => {
    try {
      new QRCode(document.getElementById(`qrcode-${item.id}`), {
        text: qrData,
        width: 100,
        height: 100,
        correctLevel: QRCode.CorrectLevel.H,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }, 0);

  return menuItem;
}

// Filter by category
function filterByCategory(category) {
  currentCategory = category;

  // Update active class on category links
  const categoryLinks = document.querySelectorAll(".category-link");
  categoryLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.category === category) {
      link.classList.add("active");
    }
  });

  // Reload menu items with new filter
  loadMenuItems();
}

// Display item details for the QR code scan page
async function displayItemDetails(id) {
  try {
    // First check if we're getting data from QR code
    const qrData = sessionStorage.getItem("qrItemData");

    let item;
    if (qrData) {
      // Parse item data from QR code
      try {
        item = JSON.parse(qrData);
        sessionStorage.removeItem("qrItemData"); // Clear the data
      } catch (e) {
        console.error("Error parsing QR data:", e);
      }
    }

    // If no QR data, use the traditional method
    if (!item) {
      // Initialize database if needed
      initDatabase();

      // Get data from localStorage
      const storedData = localStorage.getItem(DB_KEY);
      let menuItems = [];

      if (storedData) {
        menuItems = JSON.parse(storedData);
      }

      item = menuItems.find((i) => i.id === id);
    }

    if (item) {
      // Get current language
      const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
      const lang = savedLanguage;

      // Get translated item name and description
      const itemName = lang === "ar" && item.name_ar ? item.name_ar : item.name;
      const itemDescription =
        lang === "ar" && item.description_ar
          ? item.description_ar
          : item.description;

      // Convert and format price
      const convertedPrice = convertPrice(item.price);
      const formattedPrice = formatPrice(convertedPrice);

      document.body.innerHTML = `
                <header>
                    <h1>${translations[lang].itemNotFound}</h1>
                    <nav class="main-nav">
                        <div class="nav-left">
                            <!-- Left side can be used for other buttons if needed -->
                        </div>
                        <div class="nav-center">
                            <a href="index.html" class="nav-link">${translations[lang].backToMenu}</a>
                        </div>
                        <div class="nav-right">
                            <!-- Right side can be used for other buttons if needed -->
                        </div>
                    </nav>
                </header>
                <main>
                    <div class="item-detail-container">
                        <h1>${itemName}</h1>
                        <p class="item-detail-info">${itemDescription}</p>
                        <p class="item-detail-price">${formattedPrice}</p>
                        <a href="index.html" class="back-link">${translations[lang].backToMenu}</a>
                    </div>
                </main>
            `;
    } else {
      // Get current language
      const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
      const lang = savedLanguage;

      document.body.innerHTML = `
                <header>
                    <h1>${translations[lang].itemNotFound}</h1>
                    <nav class="main-nav">
                        <div class="nav-left">
                            <!-- Left side can be used for other buttons if needed -->
                        </div>
                        <div class="nav-center">
                            <a href="index.html" class="nav-link">${translations[lang].backToMenu}</a>
                        </div>
                        <div class="nav-right">
                            <!-- Right side can be used for other buttons if needed -->
                        </div>
                    </nav>
                </header>
                <main>
                    <div class="item-detail-container">
                        <p>${translations[lang].itemNotFoundMessage}</p>
                        <a href="index.html" class="back-link">${translations[lang].backToMenu}</a>
                    </div>
                </main>
            `;
    }
  } catch (error) {
    console.error("Error loading item details:", error);
  }
}

// Show modal for adding new item
function showAddItemModal() {
  isEditMode = false;
  currentItem = null;
  modalTitle.textContent = translations[currentLanguage].addItemModal;
  itemForm.reset();
  document.getElementById("item-id").value = "";

  // Set default category in form
  const categorySelect = document.getElementById("item-category");
  if (categorySelect) {
    categorySelect.value =
      currentCategory === "all" ? "lunch" : currentCategory;
  }

  itemModal.style.display = "block";
}

// Edit existing item
async function editItem(id) {
  try {
    // Initialize database if needed
    initDatabase();

    // Get data from localStorage
    const storedData = localStorage.getItem(DB_KEY);
    let menuItems = [];

    if (storedData) {
      menuItems = JSON.parse(storedData);
    }

    const item = menuItems.find((i) => i.id === id);

    if (item) {
      isEditMode = true;
      currentItem = item;
      modalTitle.textContent = translations[currentLanguage].editItemModal;
      document.getElementById("item-id").value = item.id;
      document.getElementById("item-name").value = item.name;
      document.getElementById("item-description").value = item.description;
      document.getElementById("item-price").value = item.price;
      document.getElementById("item-image").value = item.image;

      // Set category in form
      const categorySelect = document.getElementById("item-category");
      if (categorySelect) {
        categorySelect.value = item.category || "lunch";
      }

      itemModal.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading item for editing:", error);
    alert("Error loading item for editing. Please try again.");
  }
}

// Delete item
async function deleteItem(id) {
  const confirmMessage =
    currentLanguage === "en"
      ? "Are you sure you want to delete this item?"
      : "هل أنت متأكد من رغبتك في حذف هذا العنصر؟";

  if (confirm(confirmMessage)) {
    try {
      // Initialize database if needed
      initDatabase();

      // Get data from localStorage
      const storedData = localStorage.getItem(DB_KEY);
      let menuItems = [];

      if (storedData) {
        menuItems = JSON.parse(storedData);
      }

      // Filter out the item to be deleted
      menuItems = menuItems.filter((item) => item.id !== id);

      // Save back to localStorage
      localStorage.setItem(DB_KEY, JSON.stringify(menuItems));

      // Reload the menu to reflect changes
      loadMenuItems();

      const successMessage =
        currentLanguage === "en"
          ? "Item deleted successfully!"
          : "تم حذف العنصر بنجاح!";
      alert(successMessage);
    } catch (error) {
      console.error("Error deleting item:", error);
      const errorMessage =
        currentLanguage === "en"
          ? "Error deleting item. Please try again."
          : "خطأ في حذف العنصر. يرجى المحاولة مرة أخرى.";
      alert(errorMessage);
    }
  }
}

// Close modal
function closeItemModal() {
  itemModal.style.display = "none";
}

// Toggle edit mode
function toggleEditMode() {
  const body = document.body;
  const menuContainer = document.getElementById("menu-container");

  if (body.classList.contains("edit-mode")) {
    body.classList.remove("edit-mode");
    editItemsBtn.textContent = translations[currentLanguage].editItems;
  } else {
    body.classList.add("edit-mode");
    editItemsBtn.textContent = translations[currentLanguage].finishEditing;
  }
}

// Save item (add or edit)
async function saveItem(event) {
  event.preventDefault();

  const id = document.getElementById("item-id").value || Date.now().toString();
  const name = document.getElementById("item-name").value;
  const description = document.getElementById("item-description").value;
  const price = parseFloat(document.getElementById("item-price").value);
  const category = document.getElementById("item-category").value;
  const imageFile = itemImageFile.files[0];
  const imageUrl = document.getElementById("item-image").value;

  if (!name || !description || !price || (!imageFile && !imageUrl)) {
    const errorMessage =
      currentLanguage === "en"
        ? "Please fill in all fields and provide an image (either upload a file or enter a URL)"
        : "يرجى ملء جميع الحقول وتقديم صورة (إما تحميل ملف أو إدخال عنوان URL)";
    alert(errorMessage);
    return;
  }

  try {
    let image = imageUrl;

    // If a file is uploaded, convert it to a data URL
    if (imageFile) {
      image = await readFileAsDataURL(imageFile);
    }

    if (isEditMode) {
      // Update existing item
      await updateItem({ id, name, description, price, category, image });
      const successMessage =
        currentLanguage === "en"
          ? "Item updated successfully!"
          : "تم تحديث العنصر بنجاح!";
      alert(successMessage);
    } else {
      // Add new item
      const newItem = { id, name, description, price, category, image };
      await addToMenu(newItem);
      const successMessage =
        currentLanguage === "en"
          ? "Item added successfully!"
          : "تمت إضافة العنصر بنجاح!";
      alert(successMessage);
    }

    closeItemModal();
    loadMenuItems(); // Reload the menu to show the changes
  } catch (error) {
    console.error("Error saving item:", error);
    const errorMessage =
      currentLanguage === "en"
        ? "Error saving item. Please try again."
        : "خطأ في حفظ العنصر. يرجى المحاولة مرة أخرى.";
    alert(errorMessage);
  }
}

// Helper function to read file as data URL
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Add item to menu
async function addToMenu(newItem) {
  try {
    // Initialize database if needed
    initDatabase();

    // Get existing items from localStorage
    const storedData = localStorage.getItem(DB_KEY);
    let menuItems = [];

    if (storedData) {
      menuItems = JSON.parse(storedData);
    }

    // Add new item
    menuItems.push(newItem);

    // Save back to localStorage
    localStorage.setItem(DB_KEY, JSON.stringify(menuItems));
  } catch (error) {
    console.error("Error adding item to menu:", error);
    throw error;
  }
}

// Update existing item
async function updateItem(updatedItem) {
  try {
    // Initialize database if needed
    initDatabase();

    // Get existing items from localStorage
    const storedData = localStorage.getItem(DB_KEY);
    let menuItems = [];

    if (storedData) {
      menuItems = JSON.parse(storedData);
    }

    // Find and update the item
    const index = menuItems.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      menuItems[index] = updatedItem;
    }

    // Save back to localStorage
    localStorage.setItem(DB_KEY, JSON.stringify(menuItems));
  } catch (error) {
    console.error("Error updating item in menu:", error);
    throw error;
  }
}

// Initialize database
function initDatabase() {
  // Check if we have data in localStorage
  const storedData = localStorage.getItem(DB_KEY);
  if (!storedData) {
    // If no data in localStorage, initialize with default data from menu.json
    loadDefaultData();
  }
}

// Load default data from menu.json
async function loadDefaultData() {
  try {
    const response = await fetch("menu.json");
    const defaultItems = await response.json();
    localStorage.setItem(DB_KEY, JSON.stringify(defaultItems));
  } catch (error) {
    console.error("Error loading default data:", error);
  }
}

if (itemId) {
  // We're on the item detail page
  displayItemDetails(itemId);
} else {
  // We're on the main menu page
  initLanguage();
  initCurrency();
  loadMenuItems();

  // Event listeners for admin functions
  if (addItemBtn) {
    addItemBtn.addEventListener("click", showAddItemModal);
  }
  if (editItemsBtn) {
    editItemsBtn.addEventListener("click", toggleEditMode);
  }
  if (closeModal) {
    closeModal.addEventListener("click", closeItemModal);
  }
  if (itemForm) {
    itemForm.addEventListener("submit", saveItem);
  }

  // Language switcher event listeners
  if (langEnBtn) {
    langEnBtn.addEventListener("click", () => switchLanguage("en"));
  }
  if (langArBtn) {
    langArBtn.addEventListener("click", () => switchLanguage("ar"));
  }

  // Currency switcher event listener
  if (currencySelect) {
    currencySelect.addEventListener("change", function () {
      switchCurrency(this.value);
    });
  }

  // Category filter event listeners
  const categoryLinks = document.querySelectorAll(".category-link");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.dataset.category;
      filterByCategory(category);
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === itemModal) {
      closeItemModal();
    }
  });
}
