// Dữ liệu mô phỏng Món ăn
const MENU_DATA = [
    {
        id: 'p1',
        name: 'Cháo Lươn Đồng Hạt Sen',
        description: 'Lươn đồng tươi xào nghệ, hạt sen bùi béo kết hợp cháo xương hầm ngọt thanh.',
        price: 35000,
        image: 'https://cdn.eva.vn/upload/1-2021/images/2021-03-13/image5-1615626180-967-width500height400.png'
    },
    {
        id: 'p2',
        name: 'Cháo Bắp Bò Úc Bí Đỏ',
        description: 'Thịt bò Úc thượng hạng băm nhỏ, bí đỏ nấm hương giàu vitamin cho bé.',
        price: 40000,
        image: 'https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/169064/Originals/chao-bi-do-2.jpg'
    },
    {
        id: 'p3',
        name: 'Cháo Gà Ác Tiềm Thuốc Bắc',
        description: 'Gà ác hầm kỷ tử, táo đỏ, sâm dứa giúp phục hồi sức khỏe tuyệt vời.',
        price: 45000,
        image: 'https://dieutribiengan.com/wp-content/uploads/2020/01/chao-ga-ac-hat-sen-an-dam-cho-be.jpg'
    },
    {
        id: 'p4',
        name: 'Cháo Chim Bồ Câu Đậu Xanh',
        description: 'Thịt bồ câu dai thơm, đậu xanh giải nhiệt mang lại bữa ăn đậm vị quê hương.',
        price: 50000,
        image: 'https://sakuraschools.edu.vn/wp-content/uploads/2024/03/Cach-nau-chao-bo-cau-bi-do-cho-be-7-thang-bo-duong.jpg'
    },
    {
        id: 'p5',
        name: 'Cháo Cá Hồi Na Uy Rau Ngót',
        description: 'Cá hồi Na Uy giàu Omega-3 và rau ngót mát lành dịu êm.',
        price: 55000,
        image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/chao-ca-hoi-rau-ngottt.jpg'
    },
    {
        id: 'p6',
        name: 'Cháo Móng Giò Hạt Óc Chó',
        description: 'Móng giò hầm nhừ, kết hợp hạt óc chó giàu dưỡng chất trí não cho trẻ nhỏ.',
        price: 45000,
        image: 'https://www.cet.edu.vn/wp-content/uploads/2018/11/chao-mong-gio-cho-be.jpg'
    }
];

let cart = [];

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});

// Render danh sách món
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    MENU_DATA.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price-row">
                    <span class="price">${formatPrice(item.price)}</span>
                    <button class="btn-add" onclick="addToCart('${item.id}')">Thêm</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Định dạng tiền việt nam
function formatPrice(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

// Thêm vào giỏ
function addToCart(id) {
    const item = MENU_DATA.find(p => p.id === id);
    if (!item) return;

    const existItem = cart.find(c => c.id === id);
    if (existItem) {
        existItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCartUI();
    showToast();
}

// Cập nhật thay đổi số lượng
function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

// Cập nhật giao diện giỏ hàng
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Giỏ hàng của bạn đang trống.<br>Hãy chọn thêm món dinh dưỡng nhẹ bụng nhé!</div>';
        cartTotalContainer.textContent = '0₫';
        document.querySelector('.btn-checkout').disabled = true;
        document.querySelector('.btn-checkout').style.opacity = '0.5';
        return;
    }

    document.querySelector('.btn-checkout').disabled = false;
    document.querySelector('.btn-checkout').style.opacity = '1';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="">
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="item-price">${formatPrice(item.price)}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    <button class="rm-btn" onclick="removeFromCart('${item.id}')"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalContainer.textContent = formatPrice(total);
}

// Bật/tắt Sidebar Giỏ Hàng
function toggleCart(event) {
    if (event && event.target.id !== 'cart-overlay' && !event.target.classList.contains('close-btn') && !event.target.closest('.cart-icon')) {
        return;
    }
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.toggle('active');
    
    if (!overlay.classList.contains('active')) {
        setTimeout(() => closeCheckout(), 300);
    }
}

function openCheckout() {
    document.getElementById('checkout-form').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('checkout-form').style.display = 'none';
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Xử lý thanh toán -> Gửi Webhook
function submitOrder() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const add = document.getElementById('customer-address').value.trim();
    const note = document.getElementById('customer-note').value.trim();

    if (!name || !phone || !add) {
        alert("Vui lòng điền đầy đủ các ô có dấu (*)");
        return;
    }

    document.getElementById('order-status').style.display = 'flex';
    document.getElementById('loader').style.display = 'block';
    document.getElementById('success-message').style.display = 'none';

    // Tổng hợp nội dung
    const orderDetails = cart.map(item => `${item.name} (x${item.qty})`).join(', ');
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const payload = {
        name: name,
        phone: phone,
        address: add,
        note: note,
        orderInfo: orderDetails,
        total: totalAmount
    };

    // --- BẠN DÁN LINK WEBHOOK CỦA GOOGLE SHEETS VÀO ĐÂY --- //
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxJ0zLtrqMf77FKJY-7i5OuZ1t2VutqRL9TjqJivsYb765tDlKV8i6JcSoRExL3kOPo/exec';

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        showSuccess();
    })
    .catch(error => {
        alert("Có sự cố mạng, nhưng đơn hàng đã được tạo.");
        showSuccess();
    });
}

function showSuccess() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
}

function resetApp() {
    cart = [];
    updateCartUI();
    
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-address').value = '';
    document.getElementById('customer-note').value = '';
    
    document.getElementById('order-status').style.display = 'none';
    closeCheckout();
    toggleCart(); 
}
