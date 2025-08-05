export const registerFormControls = [
    {
      name: "userName",
      label: "User Name",
      placeholder: "Enter your user name",
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];
  
  export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];
  
  const staticBrands = [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ];

  export const addProductFormControls = [
    {
      name: "title",
      type: "text",
      placeholder: "Enter title",
      label: "Title",
      componentType: "input",
    },
    {
      name: "description",
      type: "text",
      placeholder: "Enter description",
      label: "Description",
      componentType: "input",
    },
    {
      name: "category",
      type: "select",
      placeholder: "Select category",
      label: "Category",
      componentType: "select",
options: [
  { id: "shirt", label: "Shirt" },
  { id: "tshirt", label: "T-Shirt" },
  { id: "jeans", label: "Jeans" },
  { id: "jacket", label: "Jacket" },
  { id: "shorts", label: "Shorts" },
{ id: "hoodie", label: "Hoodie" },
],
    },
    {
      name: "brand",
      type: "select",
      placeholder: "Enter brand",
      label: "Brand",
      componentType: "select",
      options: staticBrands,
    },
    {
      name: "price",
      type: "number",
      placeholder: "Enter price",
      label: "Price",
      componentType: "input",
    },
    {
      name: "salePrice",
      type: "number",
      placeholder: "Enter sale price",
      label: "Sale Price",
      componentType: "input",
    },

    {
      name: "sizes.XS",
      type: "number",
      placeholder: "Enter XS stock",
      label: "XS Stock",
      componentType: "input",
      min: 0,
    },
    {
      name: "sizes.S",
      type: "number",
      placeholder: "Enter S stock",
      label: "S Stock",
      componentType: "input",
      min: 0,
    },
    {
      name: "sizes.M",
      type: "number",
      placeholder: "Enter M stock",
      label: "M Stock",
      componentType: "input",
      min: 0,
    },
    {
      name: "sizes.L",
      type: "number",
      placeholder: "Enter L stock",
      label: "L Stock",
      componentType: "input",
      min: 0,
    },
    {
      name: "sizes.XL",
      type: "number",
      placeholder: "Enter XL stock",
      label: "XL Stock",
      componentType: "input",
      min: 0,
    },
    {
      name: "sizes.XXL",
      type: "number",
      placeholder: "Enter XXL stock",
      label: "XXL Stock",
      componentType: "input",
      min: 0,
    },
    {
      name: "color",
      type: "text",
      label: "Color",
      placeholder: "Enter color",
      componentType: "input",
      options: [
          { id: "red", label: "Red" },
          { id: "blue", label: "Blue" },
          { id: "black", label: "Black" },
          { id: "white", label: "White" },
          { id: "green", label: "Green" },
          { id: "yellow", label: "Yellow" },
          { id: "purple", label: "Purple" },
          { id: "pink", label: "Pink" },
          { id: "gray", label: "Gray" },
          { id: "brown", label: "Brown" },
          { id: "orange", label: "Orange" },
          { id: "gold", label: "Gold" },
          { id: "silver", label: "Silver" },
          { id: "beige", label: "Beige" },
          { id: "turquoise", label: "Turquoise" },
          { id: "coral", label: "Coral" },
          { id: "lime", label: "Lime" },
          { id: "teal", label: "Teal" },
          { id: "navy", label: "Navy" },
          { id: "maroon", label: "Maroon" },
          { id: "olive", label: "Olive" },
      ],
    },
    {
      name: "gender",
      type: "select",
      label: "Gender",
      placeholder: "Select gender",
      componentType: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
      ],
    },    
  ];

  export const getProductFormElements = (brandList = []) => {
    const formElements = [...addProductFormControls];
    
    // Find the brand control
    const brandControl = formElements.find(control => control.name === "brand");
    if (brandControl) {
      // Filter out brands that are already in staticBrands
      const dynamicBrands = brandList
        .filter(brand => !staticBrands.some(staticBrand => 
          staticBrand.label.toLowerCase() === brand.name.toLowerCase()
        ))
        .map(brand => ({
          id: brand._id,
          label: brand.name
        }));

      brandControl.options = [...staticBrands, ...dynamicBrands];
    }

    return formElements;
  };
  
  export const shoppingViewHeaderMenuItems = [
    {
      id: "home",
      label: "Home",
      path: "/shop/home",
    },
    {
      id: "products",
      label: "Products",
      path: "/shop/listing",
    },
    {
      id: "men",
      label: "Men",
      path: "/shop/listing",
    },
    {
      id: "women",
      label: "Women",
      path: "/shop/listing",
    },
    {
      id: "kids",
      label: "Kids",
      path: "/shop/listing",
    },
    {
      id: "search",
      label: "Search",
      path: "/shop/search",
    },
  ];
  
  export const categoryOptionsMap = {
    men: "Men",
    women: "Women",
    kids: "Kids",
    accessories: "Accessories",
    footwear: "Footwear",
  };
  
  export const brandOptionsMap = {
    nike: "Nike",
    adidas: "Adidas",
    puma: "Puma",
    levi: "Levi",
    zara: "Zara",
    "h&m" : "H&M",
  };
  
  export const filterOptions = {
    gender: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
    ],
    category: [
      { id: "shirt", label: "Shirt" },
      { id: "tshirt", label: "T-Shirt" },
      { id: "jeans", label: "Jeans" },
      { id: "jacket", label: "Jacket" },
      { id: "shorts", label: "Shorts" },
      { id: "hoodie", label: "Hoodie" },
    ],
    brand: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
    color: [
      { id: "red", label: "Red" },
      { id: "blue", label: "Blue" },
      { id: "black", label: "Black" },
      { id: "white", label: "White" },
      { id: "green", label: "Green" },
      { id: "yellow", label: "Yellow" },
      { id: "purple", label: "Purple" },
      { id: "pink", label: "Pink" },
      { id: "gray", label: "Gray" },
      { id: "brown", label: "Brown" },
      { id: "orange", label: "Orange" },
      { id: "gold", label: "Gold" },
      { id: "silver", label: "Silver" },
      { id: "beige", label: "Beige" },
      { id: "turquoise", label: "Turquoise" },
      { id: "coral", label: "Coral" },
      { id: "lime", label: "Lime" },
      { id: "teal", label: "Teal" },
      { id: "navy", label: "Navy" },
      { id: "maroon", label: "Maroon" },
      { id: "olive", label: "Olive" },
    ],
    rating: [
      { id: "1", label: "1 Star" },
      { id: "2", label: "2 Stars" },
      { id: "3", label: "3 Stars" },
      { id: "4", label: "4 Stars" },
      { id: "5", label: "5 Stars" },
    ]
  };
  
  export const sortOptions = [
    { id: "popular", label: "Popular" },
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];
  
  export const addressFormControls = [
    {
      label: "Address",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Enter your address",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      label: "Pincode",
      name: "pincode",
      componentType: "input",
      type: "text",
      placeholder: "Enter your pincode",
    },
    {
      label: "Phone",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      label: "Notes",
      name: "notes",
      componentType: "textarea",
      placeholder: "Enter any additional notes",
    },
  ];