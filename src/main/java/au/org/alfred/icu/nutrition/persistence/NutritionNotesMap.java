package au.org.alfred.icu.nutrition.persistence;

import au.org.alfred.icu.nutrition.persistence.auto._NutritionNotesMap;

public class NutritionNotesMap extends _NutritionNotesMap {

    private static NutritionNotesMap instance;

    private NutritionNotesMap() {}

    public static NutritionNotesMap getInstance() {
        if(instance == null) {
            instance = new NutritionNotesMap();
        }

        return instance;
    }
}
