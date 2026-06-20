// shared/types/index.ts
// ========== CYCLE DOMAIN ==========
export var CycleStatus;
(function (CycleStatus) {
    CycleStatus["ACTIVE"] = "ACTIVE";
    CycleStatus["COMPLETED"] = "COMPLETED";
    CycleStatus["PENDING"] = "PENDING";
})(CycleStatus || (CycleStatus = {}));
// ========== BUCKET DOMAIN ==========
export var BucketCategory;
(function (BucketCategory) {
    BucketCategory["NECESSITIES"] = "Necesidades";
    BucketCategory["STABILITY"] = "Estabilidad";
    BucketCategory["INVESTMENT"] = "Inversi\u00F3n";
    BucketCategory["REWARDS"] = "Recompensas";
    BucketCategory["DEBTS"] = "Deudas";
    BucketCategory["CUSTOM"] = "Personalizado";
})(BucketCategory || (BucketCategory = {}));
// ========== SNOWBALL DOMAIN ==========
export var SnowballStatus;
(function (SnowballStatus) {
    SnowballStatus["ACTIVE"] = "ACTIVE";
    SnowballStatus["COMPLETED"] = "COMPLETED";
    SnowballStatus["PAUSED"] = "PAUSED";
})(SnowballStatus || (SnowballStatus = {}));
// ========== BUDGET ADVISOR DOMAIN ==========
export var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
})(RiskLevel || (RiskLevel = {}));
export var AdvisorProfileType;
(function (AdvisorProfileType) {
    AdvisorProfileType["CONSERVATIVE"] = "CONSERVATIVE";
    AdvisorProfileType["MODERATE"] = "MODERATE";
    AdvisorProfileType["AGGRESSIVE"] = "AGGRESSIVE";
})(AdvisorProfileType || (AdvisorProfileType = {}));
