export const SENSITIVE_DATA_KEY = 'sensitive_data';

export const SensitiveData = (): PropertyDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(SENSITIVE_DATA_KEY, true, target, propertyKey);
    };
};
