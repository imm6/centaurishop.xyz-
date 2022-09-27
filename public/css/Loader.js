window.onload = () => {
    setTimeout(() => {
        $('.Loader').fadeOut(1e3);
        setTimeout(() => {
            $('.Loader').css('display', 'none');
            $('.Main').css('display', 'block')
            $('.Main').fadeIn(1e3);

             ScrollReveal().reveal('.Services');
             ScrollReveal().reveal('.Stock');
        }, 1e3);
    }, 1e3);
}