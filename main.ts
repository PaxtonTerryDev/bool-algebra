enum NumericOperator {
    E,
    DE,
    G,
    GE,
    L,
    LE,
}

enum StringOperator {
    E,
    DE,
    CONTAINS,
    STARTS_WITH,
    ENDS_WITH,
}

enum BooleanOperator {
    E,
    DE,
}

interface PredicateStrategy<T, Op> {
    compare(value: T, operator: Op, compareTo: T): boolean;
}

class NumericPredicateStrategy implements PredicateStrategy<number, NumericOperator> {
    compare(value: number, operator: NumericOperator, compareTo: number): boolean {
        switch(operator) {
            case NumericOperator.E:
                return value == compareTo;
            case NumericOperator.DE:
                return value === compareTo;
            case NumericOperator.G:
                return value > compareTo;
            case NumericOperator.GE:
                return value >= compareTo;
            case NumericOperator.L:
                return value < compareTo;
            case NumericOperator.LE:
                return value <= compareTo;
        }
    }
}

class StringPredicateStrategy implements PredicateStrategy<string, StringOperator> {
    compare(value: string, operator: StringOperator, compareTo: string): boolean {
        switch(operator) {
            case StringOperator.E:
                return value == compareTo;
            case StringOperator.DE:
                return value === compareTo;
            case StringOperator.CONTAINS:
                return value.includes(compareTo);
            case StringOperator.STARTS_WITH:
                return value.startsWith(compareTo);
            case StringOperator.ENDS_WITH:
                return value.endsWith(compareTo);
        }
    }
}

class BooleanPredicateStrategy implements PredicateStrategy<boolean, BooleanOperator> {
    compare(value: boolean, operator: BooleanOperator, compareTo: boolean): boolean {
        switch(operator) {
            case BooleanOperator.E:
                return value == compareTo;
            case BooleanOperator.DE:
                return value === compareTo;
        }
    }
}

class NumericPredicate {
    value: number;
    private shouldNegate: boolean = false;
    private strategy = new NumericPredicateStrategy();

    constructor(value: number, shouldNegate?: boolean) {
        this.value = value;
        this.shouldNegate = shouldNegate ?? false;
    }

    private compare(operator: NumericOperator, to: number): boolean {
        const res = this.strategy.compare(this.value, operator, to);
        return this.shouldNegate ? !res : res;
    }

    isNot(): NumericPredicate {
        return new NumericPredicate(this.value, true);
    }

    equalTo(to: number) {
        return this.compare(NumericOperator.E, to);
    }

    deeplyEqualTo(to: number) {
        return this.compare(NumericOperator.DE, to);
    }

    greater(to: number) {
        return this.compare(NumericOperator.G, to);
    }

    greaterEqual(to: number) {
        return this.compare(NumericOperator.GE, to);
    }

    less(to: number) {
        return this.compare(NumericOperator.L, to);
    }

    lessEqual(to: number) {
        return this.compare(NumericOperator.LE, to);
    }
}

class StringPredicate {
    value: string;
    private shouldNegate: boolean = false;
    private strategy = new StringPredicateStrategy();

    constructor(value: string, shouldNegate?: boolean) {
        this.value = value;
        this.shouldNegate = shouldNegate ?? false;
    }

    private compare(operator: StringOperator, to: string): boolean {
        const res = this.strategy.compare(this.value, operator, to);
        return this.shouldNegate ? !res : res;
    }

    isNot(): StringPredicate {
        return new StringPredicate(this.value, true);
    }

    equalTo(to: string) {
        return this.compare(StringOperator.E, to);
    }

    deeplyEqualTo(to: string) {
        return this.compare(StringOperator.DE, to);
    }

    contains(substring: string) {
        return this.compare(StringOperator.CONTAINS, substring);
    }

    startsWith(prefix: string) {
        return this.compare(StringOperator.STARTS_WITH, prefix);
    }

    endsWith(suffix: string) {
        return this.compare(StringOperator.ENDS_WITH, suffix);
    }
}

class BooleanPredicate {
    value: boolean;
    private shouldNegate: boolean = false;
    private strategy = new BooleanPredicateStrategy();

    constructor(value: boolean, shouldNegate?: boolean) {
        this.value = value;
        this.shouldNegate = shouldNegate ?? false;
    }

    private compare(operator: BooleanOperator, to: boolean): boolean {
        const res = this.strategy.compare(this.value, operator, to);
        return this.shouldNegate ? !res : res;
    }

    isNot(): BooleanPredicate {
        return new BooleanPredicate(this.value, true);
    }

    equalTo(to: boolean) {
        return this.compare(BooleanOperator.E, to);
    }

    deeplyEqualTo(to: boolean) {
        return this.compare(BooleanOperator.DE, to);
    }

    isTrue() {
        return this.equalTo(true);
    }

    isFalse() {
        return this.equalTo(false);
    }
}

export function createPredicate(value: number): NumericPredicate;
export function createPredicate(value: string): StringPredicate;
export function createPredicate(value: boolean): BooleanPredicate;
export function createPredicate(value: any): NumericPredicate | StringPredicate | BooleanPredicate {
    if (typeof value === 'number') {
        return new NumericPredicate(value);
    } else if (typeof value === 'string') {
        return new StringPredicate(value);
    } else if (typeof value === 'boolean') {
        return new BooleanPredicate(value);
    }
    throw new Error(`Unsupported type: ${typeof value}`);
}


////////////////////////////////////////////////////////////////////////////////////////////

type RuleOperator = 
    | 'E' | 'DE' | 'G' | 'GE' | 'L' | 'LE'  
    | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH'
    | 'IS_TRUE' | 'IS_FALSE';

type RuleDefinition = {
    field: string; 
    operator: RuleOperator;
    value: any;  
    negate?: boolean;
};

type ConditionalAction = {
    type: 'show' | 'hide' | 'enable' | 'disable' | 'validate' | 'setValue' | 'setOptions' | 'enableFormSubmit';
    targetField?: string;
    value?: unknown;
};

type CompoundRuleDefinition = {
    operator: 'AND' | 'OR';
    conditions: (RuleDefinition | CompoundRuleDefinition)[];
};

type FormRule = {
    id: string;
    condition: RuleDefinition | CompoundRuleDefinition;
    actions: ConditionalAction[];
};

const eventTypes = {
    sporting: [
        { name: "option1" },
        { name: "option2" }
    ]
}
const formRule: FormRule = {
    id: "rule1",
    condition: {
        operator: "AND",
        conditions: [
            { field: "eventCategory", operator: "E", value: "sportingEvent" },
        ]
    },
    actions: [
        { type: "enable", targetField: "eventType" },
        { type: "setOptions", targetField: "eventType", value: eventTypes.sporting},
    ]
};

// class RuleEvaluator {
//     evaluateRule(rule: FormRule, fieldValue: unknown): boolean {
//         if (fieldValue === undefined) {
//             return false;
//         }

//         return this.evaluateCondition(rule.condition, fieldValue);
//     }

//     private evaluateCondition(condition: RuleDefinition, fieldValue: any): boolean {
//         const predicate = createPredicate(fieldValue);
        
//         if (condition.negate && 'isNot' in predicate) {
//             return this.applyOperator(predicate.isNot(), condition.operator, condition.value);
//         }
        
//         return this.applyOperator(predicate, condition.operator, condition.value);
//     }

//     private applyOperator(
//         predicate: NumericPredicate | StringPredicate | BooleanPredicate,
//         operator: RuleOperator,
//         value: any
//     ): boolean {
//         switch (operator) {
//             case 'E':
//                 return predicate.equalTo(value);
//             case 'DE':
//                 return predicate.deeplyEqualTo(value);
            
//             case 'G':
//                 if (predicate instanceof NumericPredicate) {
//                     return predicate.greater(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
//             case 'GE':
//                 if (predicate instanceof NumericPredicate) {
//                     return predicate.greaterEqual(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
//             case 'L':
//                 if (predicate instanceof NumericPredicate) {
//                     return predicate.less(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
//             case 'LE':
//                 if (predicate instanceof NumericPredicate) {
//                     return predicate.lessEqual(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
            
//             case 'CONTAINS':
//                 if (predicate instanceof StringPredicate) {
//                     return predicate.contains(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
//             case 'STARTS_WITH':
//                 if (predicate instanceof StringPredicate) {
//                     return predicate.startsWith(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
//             case 'ENDS_WITH':
//                 if (predicate instanceof StringPredicate) {
//                     return predicate.endsWith(value);
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
            
//             case 'IS_TRUE':
//                 if (predicate instanceof BooleanPredicate) {
//                     return predicate.isTrue();
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
//             case 'IS_FALSE':
//                 if (predicate instanceof BooleanPredicate) {
//                     return predicate.isFalse();
//                 }
//                 throw new Error(`Operator ${operator} not supported for this type`);
            
//             default:
//                 throw new Error(`Unknown operator: ${operator}`);
//         }
//     }

//     evaluateAllRules(rules: FormRule[]): Map<string, ConditionalAction[]> {
//         const actionsToApply = new Map<string, ConditionalAction[]>();

//         for (const rule of rules) {
//             if (this.evaluateRule(rule)) {
//                 for (const action of rule.actions) {
//                     const existing = actionsToApply.get(action.targetField) || [];
//                     existing.push(action);
//                     actionsToApply.set(action.targetField, existing);
//                 }
//             }
//         }

//         return actionsToApply;
//     }
// }