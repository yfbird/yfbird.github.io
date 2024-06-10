let imageContainer = document.getElementById('bgImg');

function imageChange() {
    if (currentStage === "1") {
        imageContainer.setAttribute('src', './img/1.png');
    } else if (currentStage === '2') {
        imageContainer.setAttribute('src', './img/2.jpeg');
    }
}