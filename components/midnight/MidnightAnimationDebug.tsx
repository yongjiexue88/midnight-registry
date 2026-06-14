"use client";

import { useState } from "react";
import { registryAnimationAssets } from "@/data/midnightRegistryDesignSystem";

const previewClassByCategory = {
  environment: "is-environment",
  visitor: "is-visitor",
  document: "is-document",
  tool: "is-tool",
  decision: "is-decision",
  story: "is-story",
} as const;

const categoryLabels = {
  environment: "环境",
  visitor: "来客",
  document: "文件",
  tool: "工具",
  decision: "裁决",
  story: "剧情",
} as const;

const animationTranslations: Record<number, [string, string]> = {
  1: ["雨水循环", "大厅窗面持续播放。"],
  2: ["窗灯闪烁", "公寓窗灯随机明灭。"],
  3: ["台灯呼吸", "前台空闲时持续轻微脉动。"],
  4: ["日光灯嗡鸣", "低稳定度或设备故障时增强。"],
  5: ["走廊影子掠过", "深夜威胁压力升高时出现。"],
  6: ["时钟跳动", "队列和留置时间推进时触发。"],
  7: ["队列压力脉冲", "队列压力超过 60% 时触发。"],
  8: ["稳定度失真", "稳定度低于 52% 时触发。"],
  9: ["来客入场", "每个新案例开始时触发。"],
  10: ["来客待机呼吸", "来客在玻璃外等待时循环。"],
  11: ["眨眼", "角色肖像周期性触发。"],
  12: ["说话", "提问或电话回应时触发。"],
  13: ["等待", "来客等待超过 20 秒时触发。"],
  14: ["紧张", "电话或身份压力出现时触发。"],
  15: ["可疑微笑", "陷阱问题或复制记忆暴露时触发。"],
  16: ["愤怒敲门", "长时间等待或拒绝压力下触发。"],
  17: ["向前逼近", "队列压力和深夜升级时触发。"],
  18: ["眼部故障", "低稳定度下的镜像来客触发。"],
  19: ["真身暴露", "呼叫安保或伪人被揭穿时触发。"],
  20: ["来客离场", "允许或拒绝结果触发。"],
  21: ["真实住户受伤", "错误阻止真实住户时触发。"],
  22: ["复制体重影", "镜像来客与最终门岗案例触发。"],
  23: ["纸张滑入", "打开已收集文件时触发。"],
  24: ["文件选中弹动", "选择文件标签时触发。"],
  25: ["纸张悬浮", "悬停可检查纸张时触发。"],
  26: ["文件放大打开", "打开档案或通知详情时触发。"],
  27: ["文件缩小关闭", "离开文件详情时触发。"],
  28: ["档案翻页", "切入住户档案时触发。"],
  29: ["证据盖章", "标记异常理由时触发。"],
  30: ["证据固定", "把核验结果加入审批表时触发。"],
  31: ["档案污染闪烁", "第五夜污染档案出现时触发。"],
  32: ["登记簿条目弹出", "打开当夜登记簿时触发。"],
  33: ["电话拨号脉冲", "交换机接线时触发。"],
  34: ["电话接通", "有效声音返回时触发。"],
  35: ["电话死寂", "无人接听或线路中断时触发。"],
  36: ["异常通话失真", "重复声音或不可能背景声出现时触发。"],
  37: ["证件扫描光束", "运行证件扫描时触发。"],
  38: ["扫描通过", "干净扫描结果返回时触发。"],
  39: ["扫描错误", "不符、污染或设备故障时触发。"],
  40: ["CCTV 启动雪花", "打开监控终端时触发。"],
  41: ["CCTV 频道切换", "切换监控频道时触发。"],
  42: ["CCTV 放大定格", "发现并冻结异常帧时触发。"],
  43: ["提问卡翻转", "提出采访问题时触发。"],
  44: ["陷阱问题命中", "陷阱问题揭露复制记忆时触发。"],
  45: ["允许开锁", "盖下允许进入印章时触发。"],
  46: ["拒绝落闸", "盖下拒绝进入印章时触发。"],
  47: ["安保警报", "呼叫安保时触发。"],
  48: ["留置时间跳跃", "把来客置于等待时触发。"],
  49: ["正确裁决印章", "正确解决案例时触发。"],
  50: ["错误裁决刺痛", "错误解决案例时触发。"],
  51: ["声誉受损", "阻止合法来客时触发。"],
  52: ["安全受损", "放行登记错误时触发。"],
  53: ["夜晚结算转场", "结束当夜结算时触发。"],
  54: ["白日准备台打开", "进入白日准备阶段时触发。"],
  55: ["登记簿改写现实", "复制记录替换住户时触发。"],
  56: ["结局标题显现", "最终登记结局确定时触发。"],
};

export function MidnightAnimationDebug() {
  const [selectedId, setSelectedId] = useState(1);
  const [replayKey, setReplayKey] = useState(0);
  const selected =
    registryAnimationAssets.find((animation) => animation.id === selectedId) ??
    registryAnimationAssets[0];
  const selectedCopy = animationTranslations[selected.id];

  return (
    <main className="registry-animation-debug">
      <header>
        <div>
          <span>午夜登记簿 / 开发工具</span>
          <h1>动画触发调试台</h1>
          <p>点击任一事件重放代表性动效，并核对实际触发说明。共 {registryAnimationAssets.length} 个事件。</p>
        </div>
        <a href="/">返回游戏</a>
      </header>

      <section className="registry-animation-stage">
        <div
          className={`registry-animation-preview ${previewClassByCategory[selected.category]}`}
          key={`${selected.id}-${replayKey}`}
        >
          <span>#{String(selected.id).padStart(2, "0")} · {categoryLabels[selected.category]}</span>
          <strong>{selectedCopy[0]}</strong>
          <i />
        </div>
        <div>
          <span>实际触发</span>
          <h2>{selectedCopy[1]}</h2>
          <button onClick={() => setReplayKey((key) => key + 1)} type="button">
            <i className="fa-solid fa-rotate-right" /> 重放动效
          </button>
        </div>
      </section>

      <section className="registry-animation-debug-grid">
        {registryAnimationAssets.map((animation) => (
          <button
            aria-pressed={animation.id === selected.id}
            key={animation.id}
            onClick={() => {
              setSelectedId(animation.id);
              setReplayKey((key) => key + 1);
            }}
            type="button"
          >
            <span>#{String(animation.id).padStart(2, "0")} · {categoryLabels[animation.category]}</span>
            <strong>{animationTranslations[animation.id][0]}</strong>
            <small>{animationTranslations[animation.id][1]}</small>
          </button>
        ))}
      </section>
    </main>
  );
}
