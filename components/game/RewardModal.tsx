"use client";

import { useGameStore } from "@/lib/game/useGameStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const rewardIcon = (type: string) => {
  if (type === "coins") return "fa-coins";
  if (type === "stars") return "fa-star";
  if (type === "exp") return "fa-bolt";
  if (type === "food") return "fa-burger";
  if (type === "toy") return "fa-baseball";
  if (type === "outfit") return "fa-shirt";
  if (type === "furniture") return "fa-couch";
  return "fa-gift";
};

export function RewardModal() {
  const rewardModal = useGameStore((state) => state.rewardModal);
  const closeRewardModal = useGameStore((state) => state.closeRewardModal);

  return (
    <Modal open={Boolean(rewardModal)} title={rewardModal?.title ?? "Reward"} kicker="You received" onClose={closeRewardModal}>
      {rewardModal?.subtitle ? <p className="modal__subtitle">{rewardModal.subtitle}</p> : null}
      {rewardModal?.levelUp ? (
        <div className="level-up-strip">
          <i className="fa-solid fa-crown" aria-hidden="true" />
          <strong>Level {rewardModal.levelUp.level}</strong>
        </div>
      ) : null}
      <div className="reward-grid">
        {rewardModal?.rewards.map((reward) => (
          <span key={`${reward.type}-${reward.itemId ?? "currency"}`}>
            <i className={`fa-solid ${rewardIcon(reward.type)}`} aria-hidden="true" />
            <strong>{reward.amount}</strong>
            <small>{reward.itemId ?? reward.type}</small>
          </span>
        ))}
      </div>
      <Button className="modal__action" onClick={closeRewardModal}>Awesome</Button>
    </Modal>
  );
}
