export type Link = {
  url: string;
  label: string;
  active: boolean;
};

export interface IReferredUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  refferel_link: string;
  refferel: string;
  profile: string;
}

export type ReferralsRes = {
  referrer: {
    id: number;
    name: string;
    email: string;
    total_rewards: number;
    total_referred_users: number;
    balance: string;
  };

  referrals: IReferredUser[];
};
