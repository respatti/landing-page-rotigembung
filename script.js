document.addEventListener("DOMContentLoaded", function () {
  // 1. Memanggil nama toko
  const judulToko = document.getElementById("judulToko");
  if (judulToko) {
    judulToko.innerText = tokoConfig.namaToko;
  }

  const grid = document.getElementById("product-grid");
  const cartContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("totalHarga");
  const cartBadge = document.getElementById("cartBadge");

  // --- TAMBAHAN: Inisialisasi Toggle Alamat ---
  window.toggleAlamat = function(show) {
    const container = document.getElementById("alamatContainer");
    const input = document.getElementById("alamatInput");
    const pesanOngkir = document.getElementById("pesanOngkir"); // Ambil elemen pesan
    
    container.style.display = show ? 'block' : 'none';
    pesanOngkir.style.display = show ? 'block' : 'none'; // Munculkan/hilangkan pesan
    
    if (show) {
        input.setAttribute("required", "required");
    } else {
        input.removeAttribute("required");
        input.value = "";
    }
};

  let cart = [];

  // ... (kode Render Menu & Event Click tetap sama) ...
  tokoConfig.menu.forEach((item, index) => {
    grid.innerHTML += `
            <div class="product-card">
                <img src="${item.img}">
                <h3>${item.nama}</h3>
                <p>Rp ${item.harga}</p>
                <button class="btn-cta tambah" data-index="${index}">Tambah</button>
            </div>
        `;
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("tambah")) {
      const index = e.target.dataset.index;
      const item = tokoConfig.menu[index];
      const existing = cart.find((p) => p.nama === item.nama);
      if (existing) existing.qty++;
      else
        cart.push({
          nama: item.nama,
          harga: parseInt(item.harga.replace(".", "")),
          qty: 1,
        });
      renderCart();
    }
    if (e.target.classList.contains("plus")) {
      const index = e.target.dataset.index;
      cart[index].qty++;
      renderCart();
    }
    if (e.target.classList.contains("minus")) {
      const index = e.target.dataset.index;
      cart[index].qty--;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      renderCart();
    }
  });

  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;
    let totalItem = 0;
    cart.forEach((item, index) => {
      const subtotal = item.harga * item.qty;
      total += subtotal;
      totalItem += item.qty;
      cartContainer.innerHTML += `
                <div class="cart-item">
                    <span>${item.nama}</span>
                    <div class="qty-control">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <span>Rp ${subtotal.toLocaleString()}</span>
                </div>
            `;
    });
    totalEl.innerText = total.toLocaleString();
    cartBadge.innerText = totalItem;
  }

  // --- REVISI: Perbaikan Form Submit ---
  document.getElementById("orderForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const metode = document.querySelector(
      'input[name="pengiriman"]:checked',
    ).value;
    const alamat = document.getElementById("alamatInput").value;

    let pesan = "";
    let total = 0;

    cart.forEach((item) => {
      const subtotal = item.harga * item.qty;
      total += subtotal;
      pesan += `- ${item.nama} x${item.qty} (Rp ${subtotal.toLocaleString()})%0A`;
    });

    // Pesan WhatsApp yang dinamis
    let msg = `*Halo, saya ${nama}*\n`;
    msg += `*Mau pesan:*\n${pesan}`;
    msg += `*Total:* Rp${total.toLocaleString()}\n\n`;
    msg += `*Metode:* ${metode === "delivery" ? "Diantar (Delivery)" : "Ambil Sendiri (Pick Up)"}\n`;

    if (metode === "delivery") {
      msg += `*Alamat:* ${alamat}%0A`;
    }

    msg += `%0A*Mohon bantuannya ya, terima kasih!*`;

    const url = `https://wa.me/${tokoConfig.nomorWA}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
});
