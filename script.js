function shareOnFacebook() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    window.open(shareUrl, '_blank');
}

function shareOnTwitter() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(document.title); // You can customize this
    const shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`;
    window.open(shareUrl, '_blank');
}

function shareOnLinkedIn() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    window.open(shareUrl, '_blank');
}
document.addEventListener('DOMContentLoaded', function(){
    const cy = cytoscape({
        container: document.getElementById('cy'), // 指定图表容器

        elements: [
            // 节点
            {'data': {'id': '周而成', 'gender': '男'}}, 
            {'data': {'id': '刘君明', 'gender': '女'}}, 
            {'data': {'id': '乐昕荣', 'gender': '男'}}, 
            {'data': {'id': '顾欣宁', 'gender': '女'}}, 
            {'data': {'id': '沈天阔', 'gender': '男'}}, 
            {'data': {'id': '夏印荷', 'gender': '女'}}, 
            {'data': {'id': '王伊倩', 'gender': '女'}}, 
            {'data': {'id': '楼文颉', 'gender': '男'}}, 
            {'data': {'id': '李笑', 'gender': '女'}}, 
            {'data': {'id': '郭行健', 'gender': '男'}}, 
            {'data': {'id': '万天艺', 'gender': '女'}}, 
            {'data': {'id': '王品澄', 'gender': '男'}}, 
            {'data': {'id': '尤镜淞', 'gender': '男'}}, 
            {'data': {'id': '施与姚', 'gender': '女'}}, 
            {'data': {'id': '段佩辰', 'gender': '男'}}, 
            {'data': {'id': '王圣涵', 'gender': '女'}}, 
            {'data': {'id': '方徐知', 'gender': '女'}}, 
            {'data': {'id': '温伽睿', 'gender': '男'}}, 
            {'data': {'id': '朱易琳', 'gender': '女'}}, 
            {'data': {'id': '赵一玮', 'gender': '男'}}, 
            {'data': {'id': '王则元', 'gender': '男'}}, 
            {'data': {'id': '陈辰', 'gender': '女'}}, 
            {'data': {'id': '李瑞琪', 'gender': '女'}}, 
            {'data': {'id': '施展', 'gender': '男'}}, 
            {'data': {'id': '方彬羽', 'gender': '女'}}, 
            {'data': {'id': '严雍寒', 'gender': '男'}}, 
            {'data': {'id': '方晨曦', 'gender': '女'}}, 
            {'data': {'id': '张译匀', 'gender': '女'}}, 
            {'data': {'id': '黄师然', 'gender': '男'}}, 
            {'data': {'id': '陈宣妤', 'gender': '女'}}, 
            {'data': {'id': '林验', 'gender': '男'}}, 
            {'data': {'id': '董沐言', 'gender': '女'}}, 
            {'data': {'id': '葛语歆', 'gender': '女'}}, 
            {'data': {'id': '杨佳选', 'gender': '男'}}, 
            {'data': {'id': '韦子余', 'gender': '男'}}, 
            {'data': {'id': '丁西蒙', 'gender': '女'}}, 
            {'data': {'id': '白翰铭', 'gender': '男'}}, 
            {'data': {'id': '何晨杰', 'gender': '男'}}, 
            {'data': {'id': '张庭尔', 'gender': '女'}}, 
            {'data': {'id': '邓屹阳', 'gender': '男'}}, 
            {'data': {'id': '张耀天', 'gender': '男'}}, 
            {'data': {'id': '顾紫欣', 'gender': '女'}}, 
            {'data': {'id': '袁成禹', 'gender': '男'}}, 
            {'data': {'id': '张艺霏', 'gender': '女'}}, 
            {'data': {'id': '吴瑞麟', 'gender': '男'}}, 
            {'data': {'id': '周溪瑜', 'gender': '女'}}, 
            {'data': {'id': '陶依婷', 'gender': '女'}}, 
            {'data': {'id': '丁鼎钟', 'gender': '男'}}, 
            {'data': {'id': '卢政瑞', 'gender': '男'}}, 
            {'data': {'id': '王乐其', 'gender': '女'}}, 
            {'data': {'id': '孙佳择', 'gender': '男'}}, 
            {'data': {'id': '史元岳', 'gender': '男'}}, 
            {'data': {'id': '方馨', 'gender': '女'}}, 
            {'data': {'id': '张文希', 'gender': '女'}}, 
            {'data': {'id': '杨尚融', 'gender': '男'}}, 
            {'data': {'id': '李若宁', 'gender': '女'}}, 
            {'data': {'id': '李皓宇', 'gender': '男'}}, 
            {'data': {'id': '周易诚', 'gender': '男'}}, 
            {'data': {'id': '钱若瑜', 'gender': '女'}}, 
            {'data': {'id': '刘曦桐', 'gender': '女'}}, 
            {'data': {'id': '陆兮成', 'gender': '男'}}, 
            {'data': {'id': '郑筑轩', 'gender': '男'}}, 
            {'data': {'id': '刘燕霖', 'gender': '女'}}, 
            {'data': {'id': '侯思成', 'gender': '男'}}, 
            {'data': {'id': '吕韦凝', 'gender': '女'}}, 
            {'data': {'id': '陆朵朵', 'gender': '女'}}, 
            {'data': {'id': '姚舜禹', 'gender': '男'}}, 
            {'data': {'id': '周程晨', 'gender': '男'}}, 
            {'data': {'id': '孙苒苒', 'gender': '女'}}, 
            {'data': {'id': '王诗韵', 'gender': '女'}}, 
            {'data': {'id': '方谷玚', 'gender': '男'}}, 
            {'data': {'id': '吕沁然', 'gender': '女'}}, 
            {'data': {'id': '陈予谦', 'gender': '男'}}, 
            {'data': {'id': '宋宇轩', 'gender': '男'}}, 
            {'data': {'id': '葛恒嘉', 'gender': '女'}}, 
            {'data': {'id': '王祇瑞', 'gender': '男'}}, 
            {'data': {'id': '秦汉文', 'gender': '男'}}, 
            {'data': {'id': '袁橙', 'gender': '女'}}, 
            {'data': {'id': '彭泓钦', 'gender': '男'}}, 
            {'data': {'id': '赵倩楠', 'gender': '女'}}, 
            {'data': {'id': '林以衡', 'gender': '女'}}, 
            {'data': {'id': '朱闻哲', 'gender': '男'}}, 
            {'data': {'id': '黄子宸', 'gender': '男'}}, 
            {'data': {'id': '楼思越', 'gender': '女'}}, 
            {'data': {'id': '陈辰', 'gender': '女'}}, 
            {'data': {'id': '张盛洋', 'gender': '男'}}, 
            {'data': {'id': '马希予', 'gender': '女'}}, 
            {'data': {'id': '王煜菲', 'gender': '女'}}, 
            {'data': {'id': '姜一寻', 'gender': '男'}}, 
            {'data': {'id': '李瑞琪', 'gender': '女'}}, 
            {'data': {'id': '张津', 'gender': '男'}}, 
            {'data': {'id': '赵虹昇', 'gender': '男'}}, 
            {'data': {'id': '倪哲晟', 'gender': '男'}}, 
            {'data': {'id': '徐嘉一', 'gender': '女'}}, 
            {'data': {'id': '于小格', 'gender': '女'}}, 
            {'data': {'id': '王联舟', 'gender': '男'}}, 
            {'data': {'id': '曹禛', 'gender': '男'}}, 
            {'data': {'id': '张扬婧', 'gender': '女'}}, 
            {'data': {'id': '康家豪', 'gender': '男'}}, 
            {'data': {'id': '冯诗悦', 'gender': '女'}}, 
            {'data': {'id': '陈洁如', 'gender': '女'}}, 
            {'data': {'id': '卢妍文', 'gender': '女'}}, 
            {'data': {'id': '姚博文', 'gender': '男'}}, 
            {'data': {'id': '肖景元', 'gender': '男'}}, 
            {'data': {'id': '张沁媛', 'gender': '女'}}, 
            {'data': {'id': '吴弘宇', 'gender': '男'}}, 
            {'data': {'id': '王思源', 'gender': '女'}}, 
            {'data': {'id': '秦正', 'gender': '男'}}, 
            {'data': {'id': '陆宜彬', 'gender': '男'}}, 
            {'data': {'id': '姚昕妤', 'gender': '女'}}, 
            {'data': {'id': '李晗之', 'gender': '男'}}, 
            {'data': {'id': '王辰茵', 'gender': '女'}}, 
            {'data': {'id': '陈奕添', 'gender': '男'}}, 
            {'data': {'id': '武奇', 'gender': '男'}},
            {'data': {'id': '吴思涵', 'gender': '女'}},
            {'data': {'id': '陈昱桐', 'gender': '男'}},
            {'data': {'id': '姚君竹', 'gender': '男'}},
            {'data': {'id': '姜艺蕾', 'gender': '女'}},

            // 边
            { data: { id: 'e1', source: '周而成', target: '刘君明', relationship: 'EX_PARTNER' } },
            { data: { id: 'e2', source: '刘君明', target: '周而成', relationship: 'EX_PARTNER' } },
            { data: { id: 'e3', source: '李笑', target: '郭行健', relationship: 'EX_PARTNER' } },
            { data: { id: 'e4', source: '郭行健', target: '李笑', relationship: 'EX_PARTNER' } },
            { data: { id: 'e5', source: '万天艺', target: '王品澄', relationship: 'EX_PARTNER' } },
            { data: { id: 'e6', source: '王品澄', target: '万天艺', relationship: 'EX_PARTNER' } },
            { data: { id: 'e7', source: '尤镜淞', target: '施与姚', relationship: 'EX_PARTNER' } },
            { data: { id: 'e8', source: '施与姚', target: '尤镜淞', relationship: 'EX_PARTNER' } },
            { data: { id: 'e9', source: '段佩辰', target: '施与姚', relationship: 'EX_PARTNER' } },
            { data: { id: 'e10', source: '施与姚', target: '段佩辰', relationship: 'EX_PARTNER' } },
            { data: { id: 'e11', source: '段佩辰', target: '王圣涵', relationship: 'EX_PARTNER' } },
            { data: { id: 'e12', source: '王圣涵', target: '段佩辰', relationship: 'EX_PARTNER' } },
            { data: { id: 'e13', source: '朱易琳', target: '赵一玮', relationship: 'EX_PARTNER' } },
            { data: { id: 'e14', source: '赵一玮', target: '朱易琳', relationship: 'EX_PARTNER' } },
            { data: { id: 'e15', source: '王则元', target: '陈辰', relationship: 'EX_PARTNER' } },
            { data: { id: 'e16', source: '陈辰', target: '王则元', relationship: 'EX_PARTNER' } },
            { data: { id: 'e17', source: '王则元', target: '李瑞琪', relationship: 'EX_PARTNER' } },
            { data: { id: 'e18', source: '李瑞琪', target: '王则元', relationship: 'EX_PARTNER' } },
            { data: { id: 'e19', source: '施展', target: '方彬羽', relationship: 'EX_PARTNER' } },
            { data: { id: 'e20', source: '方彬羽', target: '施展', relationship: 'EX_PARTNER' } },
            { data: { id: 'e21', source: '严雍寒', target: '张译匀', relationship: 'EX_PARTNER' } },
            { data: { id: 'e22', source: '张译匀', target: '严雍寒', relationship: 'EX_PARTNER' } },
            { data: { id: 'e23', source: '严雍寒', target: '方晨曦', relationship: 'EX_PARTNER' } },
            // { data: { id: 'e24', source: '方晨曦', target: '严雍寒', relationship: 'EX_PARTNER' } },
            { data: { id: 'e25', source: '林验', target: '董沐言', relationship: 'EX_PARTNER' } },
            { data: { id: 'e26', source: '董沐言', target: '林验', relationship: 'EX_PARTNER' } },
            { data: { id: 'e27', source: '王圣涵', target: '何晨杰', relationship: 'EX_PARTNER' } },
            { data: { id: 'e28', source: '何晨杰', target: '王圣涵', relationship: 'EX_PARTNER' } },
            { data: { id: 'e29', source: '张庭尔', target: '邓屹阳', relationship: 'EX_PARTNER' } }, 
            { data: { id: 'e30', source: '邓屹阳', target: '张庭尔', relationship: 'EX_PARTNER' } },
            { data: { id: 'e31', source: '吴瑞麟', target: '周溪瑜', relationship: 'EX_PARTNER' } },
            { data: { id: 'e32', source: '周溪瑜', target: '吴瑞麟', relationship: 'EX_PARTNER' } },
            { data: { id: 'e33', source: '陶依婷', target: '丁鼎钟', relationship: 'EX_PARTNER' } },
            { data: { id: 'e34', source: '丁鼎钟', target: '陶依婷', relationship: 'EX_PARTNER' } }, 
            { data: { id: 'e35', source: '陶依婷', target: '卢政瑞', relationship: 'EX_PARTNER' } },
            { data: { id: 'e36', source: '卢政瑞', target: '陶依婷', relationship: 'EX_PARTNER' } },
            { data: { id: 'e37', source: '陶依婷', target: '袁成禹', relationship: 'EX_PARTNER' } }, 
            { data: { id: 'e38', source: '王乐其', target: '孙佳择', relationship: 'EX_PARTNER' } },
            { data: { id: 'e39', source: '孙佳择', target: '王乐其', relationship: 'EX_PARTNER' } },
            { data: { id: 'e40', source: '史元岳', target: '方馨', relationship: 'EX_PARTNER' } },
            { data: { id: 'e41', source: '方馨', target: '史元岳', relationship: 'EX_PARTNER' } },
            { data: { id: 'e42', source: '李若宁', target: '袁成禹', relationship: 'EX_PARTNER' } },
            { data: { id: 'e43', source: '袁成禹', target: '李若宁', relationship: 'EX_PARTNER' } },
            { data: { id: 'e44', source: '李若宁', target: '李皓宇', relationship: 'EX_PARTNER' } },
            { data: { id: 'e45', source: '李皓宇', target: '李若宁', relationship: 'EX_PARTNER' } },
            { data: { id: 'e46', source: '周易诚', target: '于小格', relationship: 'EX_PARTNER' } },
            { data: { id: 'e47', source: '于小格', target: '周易诚', relationship: 'EX_PARTNER' } },
            { data: { id: 'e48', source: '侯思成', target: '吕韦凝', relationship: 'EX_PARTNER' } },
            { data: { id: 'e49', source: '吕韦凝', target: '侯思成', relationship: 'EX_PARTNER' } },
            { data: { id: 'e50', source: '王诗韵', target: '温伽睿', relationship: 'EX_PARTNER' } },
            { data: { id: 'e51', source: '温伽睿', target: '王诗韵', relationship: 'EX_PARTNER' } },
            { data: { id: 'e52', source: '王诗韵', target: '方谷玚', relationship: 'EX_PARTNER' } },
            { data: { id: 'e53', source: '方谷玚', target: '王诗韵', relationship: 'EX_PARTNER' } },
            { data: { id: 'e54', source: '李瑞琪', target: '邓屹阳', relationship: 'EX_PARTNER' } },
            { data: { id: 'e55', source: '邓屹阳', target: '李瑞琪', relationship: 'EX_PARTNER' } },
            { data: { id: 'e56', source: '姚博文', target: '夏印荷', relationship: 'EX_PARTNER' } },
            { data: { id: 'e57', source: '夏印荷', target: '姚博文', relationship: 'EX_PARTNER' } },
            { data: { id: 'e58', source: '朱易琳', target: '秦正', relationship: 'EX_PARTNER' } }, 
            { data: { id: 'e59', source: '秦正', target: '朱易琳', relationship: 'EX_PARTNER' } }, 
            { data: { id: 'e60', source: '方徐知', target: '温伽睿', relationship: 'EX_PARTNER' } },
            { data: { id: 'e61', source: '温伽睿', target: '方徐知', relationship: 'EX_PARTNER' } },
            { data: { id: 'e62', source: '袁成禹', target: '张艺霏', relationship: 'EX_PARTNER' } },
            { data: { id: 'e63', source: '张艺霏', target: '袁成禹', relationship: 'EX_PARTNER' } },
            { data: { id: 'e64', source: '沈天阔', target: '夏印荷', relationship: 'EX_PARTNER' } },
            { data: { id: 'e65', source: '夏印荷', target: '沈天阔', relationship: 'EX_PARTNER' } },
            // { data: { id: 'c1', source: '沈天阔', target: '夏印荷', relationship: 'CURRENT_PARTNER' } },
            // { data: { id: 'c2', source: '夏印荷', target: '沈天阔', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c3', source: '王伊倩', target: '楼文颉', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c4', source: '楼文颉', target: '王伊倩', relationship: 'CURRENT_PARTNER' } },
            // { data: { id: 'c5', source: '方徐知', target: '温伽睿', relationship: 'CURRENT_PARTNER' } },
            // { data: { id: 'c6', source: '温伽睿', target: '方徐知', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c7', source: '葛语歆', target: '杨佳选', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c8', source: '杨佳选', target: '葛语歆', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c9', source: '韦子余', target: '李瑞琪', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c10', source: '李瑞琪', target: '韦子余', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c11', source: '周易诚', target: '钱若瑜', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c12', source: '钱若瑜', target: '周易诚', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c13', source: '丁西蒙', target: '白翰铭', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c14', source: '白翰铭', target: '丁西蒙', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c15', source: '张耀天', target: '顾紫欣', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c16', source: '顾紫欣', target: '张耀天', relationship: 'CURRENT_PARTNER' } },
            // { data: { id: 'c17', source: '袁成禹', target: '张艺霏', relationship: 'CURRENT_PARTNER' } },
            // { data: { id: 'c18', source: '张艺霏', target: '袁成禹', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c19', source: '陆朵朵', target: '姚舜禹', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c20', source: '姚舜禹', target: '陆朵朵', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c21', source: '赵一玮', target: '陈宣妤', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c22', source: '陈宣妤', target: '赵一玮', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c23', source: '张文希', target: '杨尚融', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c24', source: '杨尚融', target: '张文希', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c25', source: '李若宁', target: '邓屹阳', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c26', source: '邓屹阳', target: '李若宁', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c27', source: '吕沁然', target: '吕韦凝', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c28', source: '吕韦凝', target: '吕沁然', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c29', source: '曹禛', target: '张扬婧', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c30', source: '张扬婧', target: '曹禛', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c31', source: '姚博文', target: '姜艺蕾', relationship: 'CURRENT_PARTNER' } },
            { data: { id: 'c32', source: '姜艺蕾', target: '姚博文', relationship: 'CURRENT_PARTNER' } },

            { data: { id: 'a1', source: '周而成', target: '陈辰', relationship: 'AFFECTION' } },
            { data: { id: 'a2', source: '吴思涵', target: '陈昱桐', relationship: 'AFFECTION' } },
            { data: { id: 'a3', source: '陈予谦', target: '王伊倩', relationship: 'AFFECTION' } },
            { data: { id: 'a4', source: '陈予谦', target: '方彬羽', relationship: 'AFFECTION' } },
            { data: { id: 'a5', source: '陈予谦', target: '李若宁', relationship: 'AFFECTION' } },
            { data: { id: 'a6', source: '严雍寒', target: '楼思越', relationship: 'AFFECTION' } },
            { data: { id: 'a7', source: '何晨杰', target: '楼思越', relationship: 'AFFECTION' } },
            // { data: { id: 'a8', source: '楼思越', target: '何晨杰', relationship: 'AFFECTION' } },
            { data: { id: 'a9', source: '姚君竹', target: '王圣涵', relationship: 'AFFECTION' } },
            { data: { id: 'a10', source: '王圣涵', target: '韦子余', relationship: 'AFFECTION' } },
            { data: { id: 'a11', source: '王圣涵', target: '秦汉文', relationship: 'AFFECTION' } },
            { data: { id: 'a12', source: '秦汉文', target: '葛语歆', relationship: 'AFFECTION' } },
            { data: { id: 'a13', source: '黄子宸', target: '徐嘉一', relationship: 'AFFECTION' } },
            { data: { id: 'a14', source: '段佩辰', target: '张译匀', relationship: 'AFFECTION' } },
            { data: { id: 'a15', source: '朱闻哲', target: '林以衡', relationship: 'AFFECTION' } },
            { data: { id: 'a16', source: '何晨杰', target: '赵倩楠', relationship: 'AFFECTION' } },
            { data: { id: 'a17', source: '彭泓钦', target: '赵倩楠', relationship: 'AFFECTION' } },
            { data: { id: 'a18', source: '黄子宸', target: '万天艺', relationship: 'AFFECTION' } },
            { data: { id: 'a19', source: '宋宇轩', target: '葛恒嘉', relationship: 'AFFECTION' } },
            { data: { id: 'a20', source: '楼文颉', target: '王乐其', relationship: 'AFFECTION' } },
            { data: { id: 'a21', source: '楼文颉', target: '王煜菲', relationship: 'AFFECTION' } },
            { data: { id: 'a22', source: '侯思成', target: '陆朵朵', relationship: 'AFFECTION' } },
            { data: { id: 'a23', source: '葛恒嘉', target: '姜一寻', relationship: 'AFFECTION' } },
            { data: { id: 'a24', source: '郑筑轩', target: '方徐知', relationship: 'AFFECTION' } },
            { data: { id: 'a25', source: '张津', target: '陈宣妤', relationship: 'AFFECTION' } },
            { data: { id: 'a26', source: '张津', target: '李若宁', relationship: 'AFFECTION' } },
            { data: { id: 'a27', source: '施展', target: '方晨曦', relationship: 'AFFECTION' } },
            { data: { id: 'a28', source: '温伽睿', target: '张庭尔', relationship: 'AFFECTION' } },
            { data: { id: 'a29', source: '倪哲晟', target: '陈辰', relationship: 'AFFECTION' } },
            { data: { id: 'a30', source: '秦汉文', target: '于小格', relationship: 'AFFECTION' } },
            { data: { id: 'a31', source: '赵虹昇', target: '葛恒嘉', relationship: 'AFFECTION' } },
            { data: { id: 'a32', source: '王联舟', target: '王圣涵', relationship: 'AFFECTION' } },
            { data: { id: 'a33', source: '王圣涵', target: '王联舟', relationship: 'AFFECTION' } },
            { data: { id: 'a34', source: '康家豪', target: '钱若瑜', relationship: 'AFFECTION' } },
            { data: { id: 'a35', source: '尤镜淞', target: '方彬羽', relationship: 'AFFECTION' } },
            // { data: { id: 'a36', source: '尤镜淞', target: '王煜菲', relationship: 'AFFECTION' } },
            // { data: { id: 'a37', source: '尤镜淞', target: '冯诗悦', relationship: 'AFFECTION' } },
            { data: { id: 'a38', source: '侯思成', target: '陈辰', relationship: 'AFFECTION' } },
            { data: { id: 'a39', source: '王联舟', target: '陈洁如', relationship: 'AFFECTION' } },
            { data: { id: 'a40', source: '侯思成', target: '朱易琳', relationship: 'AFFECTION' } },
            { data: { id: 'a41', source: '侯思成', target: '冯诗悦', relationship: 'AFFECTION' } },
            { data: { id: 'a42', source: '张盛洋', target: '马希予', relationship: 'AFFECTION' } },
            { data: { id: 'a43', source: '武奇', target: '马希予', relationship: 'AFFECTION' } },
            // { data: { id: 'a44', source: '姚博文', target: '方馨', relationship: 'AFFECTION' } },
            { data: { id: 'a45', source: '肖景元', target: '刘君明', relationship: 'AFFECTION' } },
            { data: { id: 'a46', source: '吴弘宇', target: '张沁媛', relationship: 'AFFECTION' } },
            { data: { id: 'a47', source: '郑筑轩', target: '刘燕霖', relationship: 'AFFECTION' } },
            { data: { id: 'a48', source: '刘燕霖', target: '郑筑轩', relationship: 'AFFECTION' } },
            { data: { id: 'a49', source: '王思源', target: '方馨', relationship: 'AFFECTION' } },
            { data: { id: 'a50', source: '陆宜彬', target: '姚昕妤', relationship: 'AFFECTION' } },
            { data: { id: 'a51', source: '李晗之', target: '王煜菲', relationship: 'AFFECTION' } },
            { data: { id: 'a52', source: '王辰茵', target: '陈奕添', relationship: 'AFFECTION' } },
            { data: { id: 'a53', source: '朱闻哲', target: '王诗韵', relationship: 'AFFECTION' } },





        ],

        style: [
            {
                selector: 'node',
                style: {
                    'background-color': ele => ele.data('gender') === '男' ? '#1E90FF' : '#FF69B4',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'color': '#fff',
                    'text-outline-width': 2,
                    'text-outline-color': '#888',
                    'font-size': '10px',
                    'text-wrap': 'wrap',
                    'text-max-width': 80,
                    // 直接指定宽度和高度
                    'width': '60px',
                    'height': '60px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(relationship)',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -20,
                    'font-size': '8px',
                    'color': '#666',
                    'text-background-opacity': 1,
                    'text-background-color': '#fff',
                    'text-background-shape': 'roundrectangle',
                    'text-background-padding': 2,
                    'edge-text-rotation': 'autorotate'
                }
            },
            {
                selector: '[relationship = "EX_PARTNER"]',
                style: {
                    'line-style': 'dashed'
                }
            },
            {
                selector: '.highlighted',
                style: {
                    'background-color': '#ff0', // 举例：将高亮节点的背景色设置为黄色
                    'line-color': '#f00', // 将高亮边的颜色设置为红色
                    'target-arrow-color': '#f00', // 将高亮边箭头的颜色设置为红色
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }
            
        ],

        layout: {
            name: 'cose-bilkent',
            // 布局期间是否应包括节点的标签尺寸
            nodeDimensionsIncludeLabels: false,
            // 力模型迭代的刷新频率（以毫秒为单位）
            refresh: 10,
            // 布局完成后是否自动调整大小以适应视图
            fit: true,
            // 视图四周的填充量
            padding: 15,
            // 布局开始前是否随机放置节点
            randomize: true,
            // 边的理想长度
            idealEdgeLength: 100,
            // 力模型是否应该在布局期间或仅在布局结束时应用动画
            animate: 'end',
            // 动画的缓动函数
            animationEasing: 'ease-in-out',
            // 动画持续时间
            animationDuration: 1000,
            // 是否使用无穷远的理想边长（默认：false）
            infinite: true,
            // 是否避免节点重叠
            avoidOverlap: true,
            // 是否允许节点重叠
            allowNodesOverlap: false,
            // 节点重叠时的节点间距
            nodeOverlap: 15,
            // 未连接节点的斥力因子
            nodeRepulsion: 4500,
            // 边缘弹性（刚性）的理想值
            idealInterClusterEdgeLengthCoefficient: 1.4,
            // 重力大小（吸引节点到公共中心）
            gravity: 0.1,
            // 重力计算的范围（与视图比例）
            gravityRange: 3.8,
            // 重力复合节点强度
            gravityCompound: 1.0,
            // 重力范围复合
            gravityRangeCompound: 1.5,
            // 嵌套在复合节点中的节点的重力大小
            nestingFactor: 0.1,
            // 定义边缘长度计算的数值函数
        }
        
        
    });

    // 获取切换按钮和搜索框的元素
    var toggleButton = document.getElementById('toggleSearchBox');
    var searchBox = document.getElementById('searchBox');

    document.getElementById('findPath').addEventListener('click', function() {
        const startId = document.getElementById('nodeA').value.trim();
        const endId = document.getElementById('nodeB').value.trim();
        if (startId && endId) {
            // 使用 `[id='${startId}']` 和 `[id='${endId}']` 替换原来的选择器
            const shortestPath = cy.elements().aStar({ root: `[id='${startId}']`, goal: `[id='${endId}']` });
            if (shortestPath.found) {
                cy.elements().removeClass('highlighted'); // 移除之前的高亮
                shortestPath.path.addClass('highlighted'); // 高亮显示找到的路径
            } else {
                alert('No path found');
            }
        }
    });

    // 查找与特定人物有关的图
    document.getElementById('searchBtn').addEventListener('click', function() {
        var keyword = document.getElementById('searchInput').value.trim().toLowerCase();
        if (keyword) {
            // 获取与搜索关键词匹配的节点
            var targetNode = cy.nodes().filter(function(n) {
                return n.data('id').toLowerCase() === keyword;
            });

            if (targetNode.length > 0) {
                // 获取目标节点以及与之直接相连的节点和边
                var connectedElems = targetNode.connectedEdges().connectedNodes().add(targetNode.connectedEdges()).add(targetNode);
                // 隐藏所有元素
                cy.elements().not(connectedElems).style('display', 'none');
                // 仅展示与目标节点直接相关的元素
                connectedElems.style('display', 'element');
            } else {
                alert('No matching nodes found');
            }
        }
    });

    // 过滤展示特定类型的关系
    document.getElementById('filterBtn').addEventListener('click', function() {
        var selectedRelationship = document.getElementById('relationshipFilter').value;
        if (selectedRelationship) {
            // 获取所有具有选定关系类型的边
            var targetEdges = cy.edges().filter(function(e) {
                return e.data('relationship').toLowerCase() === selectedRelationship;
            });
            var connectedNodes = targetEdges.connectedNodes();
            var elementsToShow = targetEdges.add(connectedNodes);
            // 隐藏所有元素
            cy.elements().style('display', 'none');
            // 仅展示选定关系类型的边和相连的节点
            elementsToShow.style('display', 'element');
        } else {
            // 如果没有选定关系类型，则展示所有元素
            cy.elements().style('display', 'element');
        }
    });

    // 重置按钮逻辑（如果需要）
    // 当想要显示整个图时，可以使用一个重置按钮来恢复显示所有元素
    document.getElementById('resetBtn').addEventListener('click', function() {
        cy.elements().style('display', 'element');
    });
    
    // 导出为PNG
    document.getElementById('exportPng').addEventListener('click', function() {
        var png64 = cy.png(); // 获取PNG图像的base64编码
        var downloadLink = document.createElement('a');
        downloadLink.href = png64;
        downloadLink.download = 'graph.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    // 导出为JPG
    document.getElementById('exportJpg').addEventListener('click', function() {
        var jpg64 = cy.jpg(); // 获取JPG图像的base64编码
        var downloadLink = document.createElement('a');
        downloadLink.href = jpg64;
        downloadLink.download = 'graph.jpg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    /*
    // 绑定点击事件处理器到切换按钮
    toggleButton.addEventListener('click', function() {
        // 检查搜索框当前的显示状态，并切换它
        if (searchBox.style.display === 'none') {
            searchBox.style.display = 'block'; // 显示搜索框
        } else {
            searchBox.style.display = 'none'; // 隐藏搜索框
        }
    });
    */

    // 交互式增强
    cy.on('mouseover', 'node', function(event) {
        event.target.animate({
            style: { 'border-width': '2px', 'border-color': '#000', 'border-style': 'solid' }
        }, {
            duration: 200
        });
    });

    cy.on('mouseout', 'node', function(event) {
        event.target.animate({
            style: { 'border-width': 0 }
        }, {
            duration: 200
        });
    });

    cy.on('tap', 'node', function(evt) {
        var node = evt.target;
        var connectedEdges = node.connectedEdges();
        var affectionCount = connectedEdges.filter(edge => edge.data('relationship') === 'AFFECTION').length; // 计算单向关系的数量
        var otherRelationshipsCount = (connectedEdges.length - affectionCount) / 2; // 其余双向关系的数量，单向关系已经被排除
        var totalRelationships = affectionCount + otherRelationshipsCount; // 总关系数量

        var info = document.getElementById('info');
        info.innerHTML = '选中节点: ' + node.data('id') +
                        '<br>性别: ' + node.data('gender') +
                        '<br>单向关系数 (AFFECTION): ' + affectionCount +
                        '<br>双向关系数 (EX_PARTNER, CURRENT_PARTNER等): ' + otherRelationshipsCount +
                        '<br>总关系数: ' + totalRelationships;
    });
});
