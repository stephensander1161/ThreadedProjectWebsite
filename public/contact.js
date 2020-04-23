/* Coded by Romit */

$( document ).ready(function() {
    // alert('READY')
    var images = $('.img-thumbnail-agent')
    console.log('IMAGES'+images.length)
    // images.forEach((image)=>{
    //     alert(image.attr('src'))
    // })
    for (var i = 0 ; i < images.length ; i++ ) {
        images[i].src = 'media/Faces/'+i+'.jpg'
        console.log(images[i].src)
    }
})