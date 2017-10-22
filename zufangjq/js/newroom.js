$(function() {
    main(function () {
        navText("新房");
    });
    var pageNum = 1,
        pageCount = 1,
        areaId = 0,
        subAreaId = 0,
        priceMin = 0,
        priceMax = 80000,
        sizeMin = 0,
        sizeMax = 20000,
        houseType = 0,
        leaseWay = 0;
    //xfList();//显示列表
    function  xfList() {
        var json ={
            pageNum:pageNum,
            areaId:areaId,
            subAreaId:subAreaId,
            priceMin:priceMin,
            priceMax:priceMax,
            sizeMin:sizeMin,
            sizeMax:sizeMax,
            houseType:houseType,
            leaseWay:leaseWay
        };
        $.ajax({
            type:'post',
            url:'php/new_room.php',
            data:json,
            success:function (d) {
                console.log(d);
                var data= d.data;
                var htmlStr = '';

                //生成列表
                for(var i=0;i<data.length;i++){
                    htmlStr+=`<li class="clearfloat">
                                 <a href="zf_details.html?zfId=${data[i].zfId}" target="_blank"><img src="${data[i].picList[0].zfPic}" alt=""/></a>
                            <div class="information">
                                <h2><a href="zf_details.html?zfId=${data[i].zfId}" target="_blank">${data[i].title}</a></h2>
                                <p><span>${data[i].houseType}</span><span>${data[i].leaseWay}</span><span>${data[i].size}㎡</span><span>${data[i].floor}层</span><span>朝向：${data[i].orientation}</span></p>
                                <p>${data[i].community}</p>
                            </div>
                            <span><strong>${data[i].price}</strong>元/月</span>
                            </li>`;
                }
                $('.zf_list>ul').html(htmlStr);
                $('.zf_list_head strong').text(d.totalRecord);
                //页码
                var pageHtml='<a href="prev">上一页</a>';
                pageCount=d.pageCount;
                for(var i=1;i<pageCount+1;i++){
                    pageHtml+='<a href="'+i+'">'+i+'</a>';
                }
                pageHtml+='<a href="next">下一页</a>';
                $('.pages').html(pageHtml);
                if(pageNum==1){
                    $('.pages a:first').addClass('disabled');
                }
                if(pageNum==pageCount){
                    $('.pages a:last').addClass('disabled');
                }
                $('.pages a').eq(pageNum).addClass('cur');
            }
        })
    }
    //页码点击事件
    $('.pages').on('click','a',function (e) {
        e.preventDefault();
        var index=$(this).index();
        if(index==0){
            if(pageNum==1) return;
            pageNum--;
        }else if(index==pageCount+1){
            if(pageNum==pageCount) return;
            pageNum++;
        }else{
            pageNum=index;
        }
        xfList();
    })
    //加载区域
    $.ajax({
        type:'post',
        url:'php/area_list.php',
        success:function (d) {
            var areaStr=''
            for(var i=0;i<d.length;i++){
                areaStr+='<a href="" data-areaId="'+d[i].areaId+'">'+d[i].areaName+'</a>';
            }
            $('#area').append(areaStr);
        }
    })
    //为一级区域绑定事件
    $('#area').on('click','a',function (e) {
        e.preventDefault();
        $('#area a').removeChild();
        $(this).addClass('current');
        areaId=$(this).attr('data-areaId');
        subAreaId=0;
        pageNum=1;
        xfList();
        if(areaId==0){
            $('#subArea').empty().hide();
        }
    })
});