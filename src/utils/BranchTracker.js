export const BranchTracker = async (name, event) => {
  const BranchSDK = (await import('branch-sdk')).default;
  BranchSDK.init(process.env.BRANCH_SDK);

  BranchSDK.logEvent(`${name}`, event);
};

export const BranchLogout = async () => {
  const BranchSDK = (await import('branch-sdk')).default;
  BranchSDK.init(process.env.BRANCH_SDK);

  BranchSDK.setIdentity(null);

  BranchSDK.logout();
};
