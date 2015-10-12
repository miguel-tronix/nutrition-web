/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package au.org.alfred.icu.nutrition.persistence;

import java.util.Comparator;

/**
 *
 * @author miguel
 */
public class ReviewDateComparator implements Comparator {
    
    public int compare(Object rev1, Object rev2)
    {
        int ret = 0;
        if(((Review) rev1).getReviewDate().after(((Review) rev2).getReviewDate()))
        {
            ret = 1;
        }
        else if(((Review) rev1).getReviewDate().before(((Review) rev2).getReviewDate()))
        {
            ret = -1;
        }
        else if(((Review) rev1).getReviewDate().equals(((Review) rev2).getReviewDate()))
        {
            ret = 0;
        }
        
        return ret;
    }
    
}
