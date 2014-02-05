(function ($) {

    var sampleItems = [
        {
            label: "Sample A",
            contents: "A",
            click: function() { alert('Sample Item A Clicked'); }
        },
        {
            label: "Sample B",
            contents: "B",
            click: function() { alert('Sample Item B Clicked'); }
        },
        {
            label: "Sample C",
            contents: "C",
            click: function() { alert('Sample Item C Clicked'); }
        },
        {
            label: "Sample D",
            contents: "D",
            click: function() { alert('Sample Item D Clicked'); }
        },
        {
            label: "Sample E",
            contents: "E",
            click: function() { alert('Sample Item E Clicked'); }
        },
        {
            label: "Sample F",
            contents: "F",
            click: function() { alert('Sample Item F Clicked'); }
        },
        {
            label: "Sample G",
            contents: "G",
            click: function() { alert('Sample Item G Clicked'); }
        }
    ];
    function debug($obj) {
        console.log($obj);
    }
    var radar_target;
    var radar_opts;
    var radar_label = null;

    $.fn.radar = function(options, items) {
        radar_opts = $.extend({}, $.fn.radar.defaults, options);
        radar_target = $(this);
        elevate(true);
        spawnItems(sampleItems);
    };

    $.fn.radar.defaults = {
        labelPosition: 'item', // valid choices: 'bottom', 'top', 'item'
        innerRadius: '150px', // spacing between center of source item and edge of item
        itemSize: '80px', //
        pop: '10px',  // how large items expand on hover (itemSize + pop)
        elevatorId: 'radarElevator',
        zIndex: 100000,
        animSpeed: 400,
        animEasing: 'easeInOutElastic',
        itemExtraClass: '',
        borderOffsetLeft: 0,
        borderOffsetTop: 0,
    };

    function spawnItems(items) {
        var fullArc = Math.PI * 2;
        var start = 0;

        switch (radar_opts['labelPosition']) {
            case 'item':
                // 360 degrees, start.. where?
                var delta = (fullArc / items.length);
                start = (Math.PI / 2) * -1;
                radar_label = null;
                break;

            case 'top':
                fullArc = Math.PI;
                start = Math.PI * -1;
                var delta = fullArc / (items.length - 1) * -1;

                $label = $("<div />")
                    .addClass('radarLabelTop')
                    .addClass('radarHubLabel')
                    .width(parseInt(radar_opts['innerRadius']) * 2 - parseInt(radar_opts['itemSize']) * 2)
                    .css('top', (-1 * parseInt(radar_opts['itemSize'])) + 'px')
                    .appendTo($('#' + radar_opts['elevatorId'] + 'Mask'));
                radar_label = $label;

                break;

            case 'bottom':
                fullArc = Math.PI;
                start = Math.PI;
                var delta = (fullArc / (items.length - 1));

                $label = $("<div />")
                    .addClass('radarLabelBottom')
                    .addClass('radarHubLabel')
                    .width(parseInt(radar_opts['innerRadius']) * 2 - parseInt(radar_opts['itemSize']) * 2)
                    .css('top', parseInt(radar_opts['itemSize']) + 'px')
                    .appendTo($('#' + radar_opts['elevatorId'] + 'Mask'));
                radar_label = $label;

                break;
        }

        var mask = $('#' + radar_opts['elevatorId'] + 'Mask');

        for(var i=0; i<items.length; i++) {
            var angle = (delta*i) + start;
            var left = (mask.width() / 2) - (parseInt(radar_opts['itemSize']) / 2) - (parseInt(radar_opts['borderOffsetLeft']));
            var top = (mask.height() / 2) - (parseInt(radar_opts['itemSize']) / 2) - (parseInt(radar_opts['borderOffsetTop']));

            //radarElevatorMask
            $itm = $("<div />")
                .addClass('radarItem')
                .addClass('radarItem-'+i)
                .addClass(radar_opts['itemExtraClass'])
                .width(radar_opts['itemSize'])
                .height(radar_opts['itemSize'])
                .css('left', left)
                .css('top', top)
                .css('border-radius', (parseInt(radar_opts['itemSize']) / 2) + 'px')
                .css('line-height', radar_opts['itemSize'])
                .click(items[i]['click'])
                .html(items[i]['contents'])
                .data('label', items[i]['label'])
                .appendTo($('#' + radar_opts['elevatorId'] + 'Mask'));

            if (radar_opts['labelPosition'] == 'item') {
                $label = $("<div />")
                    .addClass('radarItemLabel')
                    .addClass('radarItemLabel-'+i)
                    .width(radar_opts['itemSize'])
                    .html(items[i]['label'])
                    .click(items[i]['click'])
                    .appendTo($itm);
            } else {
                $itm.mouseover(function() {
                    $label.html($(this).data('label'));
                }).mouseout(function() {
                    $label.html('');
                });
            };

            updatePosition($itm, mask, angle);
        };

        mask.find("div.radarItem").bind('click', function() {
            elevate(false);
        });
    };

    function despawnItems() {
        var mask = $('#' + radar_opts['elevatorId'] + 'Mask');
        var left = (mask.width() / 2) - (parseInt(radar_opts['itemSize']) / 2) - parseInt(radar_opts['borderOffsetLeft']);
        var top = (mask.height() / 2) - (parseInt(radar_opts['itemSize']) / 2) - parseInt(radar_opts['borderOffsetTop']);

        mask.find('.radarItem').animate({
            'left': left,
            'top': top
        }, radar_opts['animSpeed'], radar_opts['animEasing']);
    }

    function updatePosition(target, mask, angle) {
        // Find the new center
        var x1 = (parseInt(mask.width()) / 2) + (Math.cos(angle) * parseInt(radar_opts['innerRadius'])) - parseInt(radar_opts['borderOffsetLeft']);
        var y1 = (parseInt(mask.height()) / 2) + (Math.sin(angle) * parseInt(radar_opts['innerRadius'])) - parseInt(radar_opts['borderOffsetTop']);

        x1 = x1 - (parseInt(radar_opts['itemSize']) / 2);
        y1 = y1 - (parseInt(radar_opts['itemSize']) / 2);

        //target.css('left', x1);
        //target.css('top', y1);
        target.animate({
            left: x1,
            top: y1
        }, radar_opts['animSpeed'], radar_opts['animEasing']);
    }


    function elevate(show) {
        if (show) {
            // Raise the target element

            // Back up the original z-index
            radar_target.data('zIndex', radar_target.css('z-index'));
            radar_target.data('position', radar_target.css('position'));

            // Elevate the target
            if (radar_target.css('position') == 'static') {
                radar_target.css('position', 'relative');
            }
            radar_target.css('z-index', 100000);

            // Create the Overlay
            var $overlay = $("<div />")
                .attr('id', radar_opts['elevatorId'] + 'Overlay')
                .addClass('radar-elevator-overlay')
                .width($('body').width())
                .height($('body').height())
                .css('left', 0)
                .css('top', 0)
                .css('position', 'absolute')
                .css('z-index', 99998)
                .css('display', 'none')
                .appendTo('body')
                .fadeIn();

            // Create the Elevator
            var $elevator = $("<div />")
                .attr('id', radar_opts['elevatorId'])
                .addClass('radar-elevator')
                .width(radar_target.width() * 2)
                .height(radar_target.height() * 2)
                .css('left', radar_target.offset().left - (radar_target.width() / 2))
                .css('top', radar_target.offset().top - (radar_target.height() / 2))
                .css('position', 'absolute')
                .css('z-index', 99999)
                .css('display', 'none')
                .appendTo('body')
                .fadeIn();

            // Create the Elevator Mask
            var $mask = $("<div />")
                .attr('id', radar_opts['elevatorId'] + 'Mask')
                .addClass('radar-elevator-mask')
                .width(radar_target.width() * 2)
                .height(radar_target.height() * 2)
                .css('left', radar_target.offset().left - (radar_target.width() / 2))
                .css('top', radar_target.offset().top - (radar_target.height() / 2))
                .css('position', 'absolute')
                .css('z-index', 110000)
                .css('display', 'none')
                .appendTo('body')
                .fadeIn();

            $overlay.click(function() {
               elevate(false);
            });

        } else {
            // Lower the target element
            despawnItems();
            $('#' + radar_opts['elevatorId']).fadeOut(function(){$(this).remove();});
            $('#' + radar_opts['elevatorId'] + 'Mask').fadeOut(function(){$(this).remove();});
            $('#' + radar_opts['elevatorId'] + 'Overlay').fadeOut(function(){
                radar_target.css('z-index', radar_target.data('zIndex'));
                radar_target.css('position', radar_target.data('position'));
                radar_target.css('top', radar_target.data('top'));
                radar_target.css('left', radar_target.data('left'));
                $(this).remove();
            });
        };
    };

}(jQuery));
    