TransitionManager = (function() {
    var TransitionManager = {};

    var machine = document.getElementById('machine');
    var shop = document.getElementById('shop');

    var machineWidth = machine.clientWidth;

    var dest = 0;

    var update = function() {
        var dx = Math.ceil((dest - window.scrollX) / 75);
        if (Math.abs(dx) > 8) {
            dx = 8 * dx / Math.abs(dx)
        }

        var scrollX = window.scrollX + dx;

        if (scrollX < dest && dx < 0
         || scrollX > dest && dx > 0)
            scrollX = dest;

        window.scroll(scrollX, 0);

        if (scrollX === dest || dx === 0 || window.scrollX !== scrollX) {
            TransitionManager.onComplete();
            TransitionManager.onComplete = function() {};
        }
        else {
            window.requestAnimFrame(update);
        }
    }

    TransitionManager.toMachine = function(quick) {
        if (!quick) {            
            dest = 0;
            update();
        }
        else {
            window.scroll(0, 0);
        }
    };

    TransitionManager.toShop = function(quick) {
        if (!quick) {
            dest = machineWidth;
            update();
        }
        else {
            window.scroll(machineWidth, 0);
        }
    };

    TransitionManager.onComplete = function() {};

    return TransitionManager;
})();