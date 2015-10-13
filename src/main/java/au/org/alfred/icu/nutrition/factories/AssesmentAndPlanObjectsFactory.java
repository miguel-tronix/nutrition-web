/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package au.org.alfred.icu.nutrition.factories;

import au.org.alfred.icu.nutrition.persistence.Assesmentandplan;
import org.apache.cayenne.CayenneRuntimeException;
import org.apache.cayenne.access.DataContext;
import org.apache.cayenne.exp.Expression;
import org.apache.cayenne.exp.ExpressionFactory;
import org.apache.cayenne.query.SelectQuery;
import au.org.alfred.icu.nutrition.persistence.Review;
import au.org.alfred.icu.nutrition.persistence.ReviewDateComparator;
import au.org.alfred.icu.nutrition.plotting.NutritionPlotObject;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.cayenne.query.Ordering;
import org.apache.cayenne.query.SQLTemplate;
import org.apache.cayenne.query.SortOrder;

/**
 *
 * @author nevilej
 */
public abstract class AssesmentAndPlanObjectsFactory {

    private static DataContext dc;

    public static List getAssessmentAndPlanMatchingObject(Assesmentandplan aapo) {
        System.out.println("Date: "+aapo.getAssesmentDate()+" AdmID: "+aapo.getAdmId()+" Extra Plan: "+aapo.getExtraPlan());
        Expression exp = ExpressionFactory.matchExp(Assesmentandplan.ASSESMENT_DATE_PROPERTY, aapo.getAssesmentDate()).andExp(ExpressionFactory.matchExp(Assesmentandplan.ADM_ID_PROPERTY,aapo.getAdmId())).andExp(ExpressionFactory.matchExp(Assesmentandplan.EXTRA_PLAN_PROPERTY,aapo.getExtraPlan()));
        SelectQuery qry = new SelectQuery(Assesmentandplan.class,exp);
        List l = getDataContext().performQuery(qry);
        return l;
    }

    public static  DataContext getDataContext()
    {

        if(dc == null)
            dc = org.apache.cayenne.access.DataContext.createDataContext("NutritionNotes");
        return dc;

    }

    public static List getAssesmentAndPlans(String AdmId) {
        
        List mObjs = null;

         try
        {
            Expression exp = ExpressionFactory.matchExp(Assesmentandplan.ADM_ID_PROPERTY, AdmId);
            SelectQuery qry = new SelectQuery(Assesmentandplan.class, exp);
            qry.addOrdering(new Ordering(Assesmentandplan.ASSESMENT_DATE_PROPERTY, SortOrder.DESCENDING));
            mObjs = getDataContext().performQuery(qry);
            if(mObjs.isEmpty())
                mObjs.add(getNewAssesmentAndPlan(AdmId));
        }
        catch(CayenneRuntimeException e)
        {
            if(mObjs == null)
                mObjs = new ArrayList<Assesmentandplan>();
            mObjs.add(getNewAssesmentAndPlan(AdmId));
        }
        return mObjs;
    }

    
    
    public static Assesmentandplan getNewAssesmentAndPlan(String AdmId){
        Assesmentandplan mObj = null;

        try {
            mObj = getDataContext().newObject(Assesmentandplan.class);
        }
        catch (CayenneRuntimeException e){
            mObj = (Assesmentandplan) getDataContext().newObject(Assesmentandplan.class);
        }
        if (mObj.getAdmId() == null || mObj.getAdmId().equals("none"))
            mObj.setAdmId(AdmId); 
        return mObj;

    }
    
    public static boolean setAssesmentAndPlan(String xml){
        boolean rtrn = false;
        
        return rtrn;

    }

    public static boolean setAssesmentAndPlanObject(Assesmentandplan aapo) {
        boolean rtn = false;
        List l = getAssessmentAndPlanMatchingObject(aapo);
        if(l.size() > 0 && l.size() < 2)
        {
            Assesmentandplan temp = (Assesmentandplan) l.get(0);
            temp.clone(aapo);
        }
        else
            getDataContext().registerNewObject(aapo);
        try
        {
            getDataContext().commitChanges();
            rtn = true;
        }
        catch(CayenneRuntimeException ex)
        {
         
             Logger.getLogger(AssesmentAndPlanObjectsFactory.class.getName()).log(Level.SEVERE, null, ex);
             getDataContext().rollbackChanges();
        }
        
        return rtn;
    }

    public static boolean setReviewObject(Review ro, Assesmentandplan ao) {
        boolean res = false;
        try
        {
            System.out.println("ANP: "+ao.getReviewArray().size());
            Iterator itr = ao.getReviewArray().iterator();
            while(itr.hasNext())
            {
                Review test = (Review) itr.next();
                if(test.getReviewDate().equals(ro.getReviewDate()))
                {
                    test.clone(ro);
                    getDataContext().deleteObject(test);
                    break;
                }
            }
            ro.setToAssesmentandplan(ao);
            getDataContext().commitChanges();
            res = true;
        }
        catch(CayenneRuntimeException ex)
        {
            getDataContext().rollbackChanges();
        }
        return res;
    }
    
    public static boolean removeReviewObject(Review ro, Assesmentandplan ao) {
        boolean res = false;
        try
        {
            Iterator itr = ao.getReviewArray().iterator();
            while(itr.hasNext())
            {
                Review test = (Review) itr.next();
                if(test.getReviewDate().equals(ro.getReviewDate()))
                {
                    ro = test;
                    res = true;
                }
            }
            //test.clone(ro);
                    //getDataContext().deleteObject(test);
            if(res)
            {
            getDataContext().deleteObject(ro);
            getDataContext().commitChanges();
            }
                    //break;
        }
        catch(CayenneRuntimeException ex)
        {
            getDataContext().rollbackChanges();
        }
        return res;
    }

    public static Review getNewReviewObject() {
        Review mObj = null;
         try {
            mObj = (Review) getDataContext().newObject(Review.class);
        }
        catch (CayenneRuntimeException e){
            mObj = new Review();
        }
         
        return mObj;
        
    }

    /**
     * 
     * @param ICUAdmId Unique patient ICU admission record number
     * @return number of days since last bowel movement
     * 
     * Looks for all review objects assigned to the patient in descending order
     * and compares the number of days between the current date and the date of the
     * last recorded bowel movement
     * 
     */
    public static int getDaysSinceBowelMovementICU(String ICUAdmId) {
        int days = -1;
        List reviews = getReviewsForICUAdmId(ICUAdmId);
        if(!reviews.isEmpty())
        {
            Review lastBowelMovement = null;
            Iterator ritr = reviews.iterator();
            while(ritr.hasNext())
            {
                lastBowelMovement = (Review) ritr.next();
                if(lastBowelMovement.getBowelActions() != 0)
                    break;
            }
            
            if(lastBowelMovement != null)
            {
                org.joda.time.DateTime last = new org.joda.time.DateTime(lastBowelMovement.getReviewDate());
                org.joda.time.DateTime today = new org.joda.time.DateTime();
                days = org.joda.time.Days.daysBetween(last, today).getDays();
                
            }
        }
        return days;
    }
    
    /**
     * 
     * @param AdmId Unique patient hospital admission record number
     * @return number of days since last bowel movement
     * 
     * Looks for all review objects assigned to the patient in descending order
     * and compares the number of days between the current date and the date of the
     * last recorded bowel movement
     * 
     */
    public static int getDaysSinceBowelMovementHosp(String AdmId) {
        int days = -1;
        List reviews = getReviewsForAdmId(AdmId);
        if(!reviews.isEmpty())
        {
            Review lastBowelMovement = null;
            Iterator ritr = reviews.iterator();
            while(ritr.hasNext())
            {
                lastBowelMovement = (Review) ritr.next();
                if(lastBowelMovement.getBowelActions() != 0) {
                    break;
                }
            }
            
            if(lastBowelMovement != null)
            {
                org.joda.time.DateTime last = new org.joda.time.DateTime(lastBowelMovement.getReviewDate());
                org.joda.time.DateTime today = new org.joda.time.DateTime();
                days = org.joda.time.Days.daysBetween(last, today).getDays();
                
            }
        }
        return days;
    }

    /**
     * 
     * @param ICUAdmID ID of ICU admission
     * @return List of review object for the ICU admission
     * 
     * Gets a list of review objects for single ICU admission
     */
    public static List getReviewsForICUAdmId(String ICUAdmID) {
        List reviews ;
        try
        {
            Expression exp = ExpressionFactory.matchExp(Review.I_CUADM_ID_PROPERTY, Integer.valueOf(ICUAdmID));
            SelectQuery qry = new SelectQuery(Review.class,exp);
            qry.addOrdering(new Ordering(Review.REVIEW_DATE_PROPERTY, SortOrder.DESCENDING));
            reviews = getDataContext().performQuery(qry);
        }
        catch(CayenneRuntimeException ex)
        {
            reviews = new ArrayList<Review>();
        }
        return reviews;
    }
    
    
     /**
     * 
     * @param anp_id ID of assessment/plan the review is tied to.
     * @return List of review object for the assessment/plan
     * 
     * Gets a list of review objects for single hospital admission
     */
    public static List getReviewsForANPId(String anp_id) {
        List reviews ;
        try
        {
            Expression exp = ExpressionFactory.matchDbExp(Review.ASSESMENTANDPLAN_ID_PK_COLUMN, Integer.parseInt(anp_id));
            SelectQuery qry = new SelectQuery(Review.class,exp);
            qry.addOrdering(new Ordering(Review.REVIEW_DATE_PROPERTY, SortOrder.DESCENDING));
            reviews = getDataContext().performQuery(qry);
        }
        catch(CayenneRuntimeException ex)
        {
            reviews = new ArrayList<Review>();
            ex.printStackTrace(System.out);
        }
        return reviews;
    }
    
     /**
     * 
     * @param AdmId Unique hospital admission number
     * @return List of review object for the hospital admission
     * 
     * Gets a list of review objects for single hospital admission
     */
    public static List getReviewsForAdmId(String AdmId) {
        List anp = null ;
        List reviews = new ArrayList<Review>();
        try
        {
            Expression exp = ExpressionFactory.matchExp(Assesmentandplan.ADM_ID_PROPERTY,AdmId);
            SelectQuery qry = new SelectQuery(Assesmentandplan.class,exp);
            anp = getDataContext().performQuery(qry);
            if(anp != null && !anp.isEmpty())
            {
                Iterator anp_itr = anp.iterator();
                while(anp_itr.hasNext())
                {
                    Assesmentandplan p = (Assesmentandplan) anp_itr.next();
                    reviews.addAll(p.getReviewArray());
                }
                
                if(!reviews.isEmpty())
                {
                    //sort entire list 
                    Comparator comp = new ReviewDateComparator();
                    Collections.sort(reviews, Collections.reverseOrder(comp) );
                }
            }
        }
        catch(CayenneRuntimeException ex)
        {
            reviews = new ArrayList<Review>();
        }
        
        return reviews;
    }

    /**
     * 
     * @param AdmId Unique admission number
     * @return Map of plot objects for the patient for a single hospital visit
     * 
     * Gets a plots for a single hospital visit 
     */
    public static Map getPlotListForAdmId(String AdmId, String sex, int age) {
        List plans ;
        java.util.TreeMap<Date,NutritionPlotObject> dict = new TreeMap<Date, NutritionPlotObject>();
        try
        {
             String findDistinctICUAdmIDs = "select * from nutrition.assesmentandplan" +
                " Where nutrition.assesmentandplan.AdmID = '$admid' " +
                "Order By nutrition.assesmentandplan.AssesmentDate ASC";
        
            SQLTemplate tplt = new SQLTemplate(Assesmentandplan.class, findDistinctICUAdmIDs);
            tplt.setParameters(Collections.singletonMap("admid", AdmId));
            List<Assesmentandplan> idl = (List<Assesmentandplan>) getDataContext().performQuery(tplt);
            Iterator itr = idl.iterator();
            while(itr.hasNext())
            {
                String anp_id = ((Assesmentandplan) itr.next()).getObjectId().getIdSnapshot().get(Assesmentandplan.ID_PK_COLUMN).toString();
                dict.putAll(getPlotListForANPId(anp_id, sex, age));
            }
        }
        catch(CayenneRuntimeException ex)
        {
            ex.printStackTrace(System.out);
        }
        return dict;
    }
    
    /**
     * 
     * @param PMIId Unique patient universal record number
     * @param sex
     * @param age
     * @return Map of plot objects for the patient
     * 
     * Gets a plots for all hospital admissions for a unique patient
     */
    public static Map getPlotListForPMIId(String PMIId, String sex, int age) {
        List plans ;
        java.util.TreeMap<Date,NutritionPlotObject> dict = new TreeMap<Date, NutritionPlotObject>();
        try
        {
             String findDistinctICUAdmIDs = "select * from assesmentandplan" +
                " Where assesmentandplan.UR = '$pmiid' " +
                "Order By assesmentandplan.AssesmentDate ASC";
        
            SQLTemplate tplt = new SQLTemplate(Assesmentandplan.class, findDistinctICUAdmIDs);
            tplt.setParameters(Collections.singletonMap("pmiid", PMIId));
            List<Assesmentandplan> idl = (List<Assesmentandplan>) getDataContext().performQuery(tplt);
            Iterator itr = idl.iterator();
            while(itr.hasNext())
            {
                dict.putAll(getPlotListForANPId((((Assesmentandplan)itr.next()).getObjectId().getIdSnapshot().get(Assesmentandplan.ID_PK_COLUMN).toString()), sex, age));
            }
        }
        catch(CayenneRuntimeException ex)
        {
            
        }
        return dict;
    }

    
    public static Map getPlotListForICUAdmId(String ICUAdmID, String sex, int age) {
        
        java.util.TreeMap<Date,NutritionPlotObject> dict = new TreeMap<Date, NutritionPlotObject>();
        
        //Get all reviews 
        
        List reviews = getReviewsForICUAdmId(ICUAdmID);
        
        Date reviewDate = null;
        
        if(reviews.size() > 0)
        {
            Iterator r_itr = reviews.iterator();
            while(r_itr.hasNext())
            {
                NutritionPlotObject po = new NutritionPlotObject();
                Review rv = (Review) r_itr.next();
                if(reviewDate != null && rv.getReviewDate() == reviewDate){
                    continue;
                }
                reviewDate = rv.getReviewDate();
                
                Assesmentandplan pln = rv.getToAssesmentandplan();
                /*Double totalEnergy = calculateTotalDailyEnergy(pln.getENTarget().doubleValue(),
                                                               pln.getENHoursFeed().doubleValue(),
                                                               Integer.parseInt(pln.getENFormula()),
                                                               pln.getPNTargetRate().doubleValue(),
                                                               pln.getPNHoursFeed().doubleValue(),
                                                               Integer.parseInt(pln.getPNFormula()),
                                                               pln.getOralEstimateEnergy(),
                                                               pln.getWeight().doubleValue(),
                                                               "MJ");*/
                Double totalEnergy = getPlanEnergy(pln, sex, age);
                
                /*Double totalProtein =  calculateTotalDailyProtein(pln.getENTarget().doubleValue(),
                                                                 pln.getENHoursFeed().doubleValue(),
                                                                 Integer.parseInt(pln.getENFormula()),
                                                                 pln.getPNTargetRate().doubleValue(),
                                                                 pln.getPNHoursFeed().doubleValue(),
                                                                 Integer.parseInt(pln.getPNFormula()),
                                                                 pln.getOralEstimateProtein());*/
                
                Double totalProtein = getPlanProtein(pln, sex,age);
               
               Double deliveredEnergyEN = calculateDeliveredEnergyEN(rv.getENrecieved(), Integer.parseInt(pln.getENFormula()));
               Double deliveredProteinEN = calculateDeliveredProteinEN(rv.getENrecieved(), Integer.parseInt(pln.getENFormula()));
               Double deliveredEnergyPN = calculateDeliveredEnergyPN(rv.getPNreceived(), Integer.parseInt(pln.getPNFormula()));
               Double deliveredProteinPN = calculateDeliveredProteinPN(rv.getPNreceived(), Integer.parseInt(pln.getPNFormula()));
               Double deliveredEnergy = deliveredEnergyEN + deliveredEnergyPN + rv.getOralEnergyReceived();
               Double deliveredProtein = deliveredProteinEN + deliveredProteinPN + rv.getOralProteinReceived().doubleValue();
                
               po.setTargetEnergy(totalEnergy);
               po.setTargetProtient(totalProtein);
               po.setDeliveredEnergy(deliveredEnergy);
               po.setDeliveredProtein(deliveredProtein);
               po.setDeliveredEnergyEN(deliveredEnergyEN);
               po.setDeliveredEnergyON(rv.getOralEnergyReceived());
               po.setDeliveredEnergyPN(deliveredEnergyPN);
               po.setDeliveredProteinEN(deliveredProteinEN);
               po.setDeliveredProteinON(rv.getOralProteinReceived().doubleValue());
               po.setDeliveredProteinPN(deliveredProteinPN);
               Double enTargetVol = (double) (pln.getENTarget() * pln.getENHoursFeed());
               Double pnTargetVol = (double) (pln.getPNTargetRate() * pln.getPNHoursFeed());
               Double targetEnergyEN = calculateDeliveredEnergyEN(enTargetVol,Integer.parseInt(pln.getENFormula()));
               Double targetEnergyPN = calculateDeliveredEnergyEN(pnTargetVol,Integer.parseInt(pln.getPNFormula()));
               Double targetProteinEN = calculateDeliveredProteinEN(enTargetVol,Integer.parseInt(pln.getENFormula()));
               Double targetProteinPN = calculateDeliveredEnergyEN(pnTargetVol,Integer.parseInt(pln.getPNFormula()));
               po.setTargetEnergyEN(targetEnergyEN);
               po.setTargetEnergyON(pln.getOralEstimateEnergy());
               po.setTargetEnergyPN(targetEnergyPN);
               po.setTargetProteinEN(targetProteinEN);
               po.setTargetProteinON(pln.getOralEstimateProtein().doubleValue());
               po.setTargetProteinPN(targetProteinPN);
               po.setBowelMovements(rv.getBowelActions().intValue());
               po.setGastricAspirate(rv.getTotalGastricApirateVolume().intValue());
               po.setTargetsDate(pln.getAssesmentDate());
               po.setDeliveredDate(rv.getReviewDate());
               
               if(dict.isEmpty())
               {
                   dict.put(po.getDeliveredDate(),po);
               }
               else
               {
                   if(dict.containsKey(po.getDeliveredDate()))
                   {
                       NutritionPlotObject tmp = (NutritionPlotObject) dict.get(po.getDeliveredDate());
                       double tmpTotalEnergy = tmp.getDeliveredEnergy() + po.getDeliveredEnergy();
                       double tmpTotalProtein = tmp.getDeliveredProtein() + po.getDeliveredProtein();
                       double tmpDeliveredEnergyEN = tmp.getDeliveredEnergyEN() + po.getDeliveredEnergyEN();
                       double tmpDeliveredEnergyPN = tmp.getDeliveredEnergyPN() + po.getDeliveredEnergyPN();
                       double tmpDeliveredEnergyON = tmp.getDeliveredEnergyON() + po.getDeliveredEnergyON();
                       double tmpDeliveredProteinEN = tmp.getDeliveredProteinEN() + po.getDeliveredProteinEN();
                       double tmpDeliveredProteinPN = tmp.getDeliveredProteinPN() + po.getDeliveredProteinPN();
                       double tmpDeliveredProteinON = tmp.getDeliveredProteinON() + po.getDeliveredProteinON();
                       
                       tmp.setDeliveredEnergy(tmpTotalEnergy);
                       tmp.setDeliveredProtein(tmpTotalProtein);
                       tmp.setDeliveredEnergyEN(tmpDeliveredEnergyEN);
                       tmp.setDeliveredEnergyON(tmpDeliveredEnergyON);
                       tmp.setDeliveredEnergyPN(tmpDeliveredEnergyPN);
                       tmp.setDeliveredProteinEN(tmpDeliveredProteinEN);
                       tmp.setDeliveredProteinON(tmpDeliveredProteinON);
                       tmp.setDeliveredProteinPN(tmpDeliveredProteinPN);
                       
                       
                   }
                   else
                   {
                       dict.put(po.getDeliveredDate(), po);
                   }
               }
                
            }
        }
       
        
        return dict;
        
    }
    
    public static Map getPlotListForANPId(String anp_id, String sex, int age) {
        
        java.util.TreeMap<Date,NutritionPlotObject> dict = new TreeMap<Date, NutritionPlotObject>();
        
        //Get all reviews 
        
        List reviews = getReviewsForANPId(anp_id);
        
        if(reviews.size() > 0)
        {
            Iterator r_itr = reviews.iterator();
            while(r_itr.hasNext())
            {
                NutritionPlotObject po = new NutritionPlotObject();
                Review rv = (Review) r_itr.next();
                Assesmentandplan pln = rv.getToAssesmentandplan();
                /*Double totalEnergy = calculateTotalDailyEnergy(pln.getENTarget().doubleValue(),
                                                               pln.getENHoursFeed().doubleValue(),
                                                               Integer.parseInt(pln.getENFormula()),
                                                               pln.getPNTargetRate().doubleValue(),
                                                               pln.getPNHoursFeed().doubleValue(),
                                                               Integer.parseInt(pln.getPNFormula()),
                                                               pln.getOralEstimateEnergy(),
                                                               pln.getWeight().doubleValue(),
                                                               "MJ");*/
                Double totalEnergy = getPlanEnergy(pln, sex, age);
                
                 /*Double totalProtein =  calculateTotalDailyProtein(pln.getENTarget().doubleValue(),
                                                                 pln.getENHoursFeed().doubleValue(),
                                                                 Integer.parseInt(pln.getENFormula()),
                                                                 pln.getPNTargetRate().doubleValue(),
                                                                 pln.getPNHoursFeed().doubleValue(),
                                                                 Integer.parseInt(pln.getPNFormula()),
                                                                 pln.getOralEstimateProtein());*/
                
                Double totalProtein = getPlanProtein(pln, sex,age);
               
               Double deliveredEnergyEN = calculateDeliveredEnergyEN(rv.getENrecieved(), Integer.parseInt(pln.getENFormula()));
               Double deliveredProteinEN = calculateDeliveredProteinEN(rv.getENrecieved(), Integer.parseInt(pln.getENFormula()));
               Double deliveredEnergyPN = calculateDeliveredEnergyPN(rv.getPNreceived(), Integer.parseInt(pln.getPNFormula()));
               Double deliveredProteinPN = calculateDeliveredProteinPN(rv.getPNreceived(), Integer.parseInt(pln.getPNFormula()));
               Double deliveredEnergyPropofol = calculateDeliveredEnergyPropofol(rv.getPropofol(),0);
               Double deliveredEnergy = deliveredEnergyEN + deliveredEnergyPN + rv.getOralEnergyReceived() + deliveredEnergyPropofol;
               Double deliveredProtein = deliveredProteinEN + deliveredProteinPN + rv.getOralProteinReceived().doubleValue();
                
               po.setTargetEnergy(totalEnergy);
               po.setTargetProtient(totalProtein);
               po.setDeliveredEnergy(deliveredEnergy);
               po.setDeliveredProtein(deliveredProtein);
               po.setDeliveredEnergyEN(deliveredEnergyEN);
               po.setDeliveredEnergyON(rv.getOralEnergyReceived());
               po.setDeliveredEnergyPN(deliveredEnergyPN);
               po.setDeliveredEnergyPropofol(deliveredEnergyPropofol);
               po.setDeliveredProteinEN(deliveredProteinEN);
               po.setDeliveredProteinON(rv.getOralProteinReceived().doubleValue());
               po.setDeliveredProteinPN(deliveredProteinPN);
               Double enTargetVol = (double) (pln.getENTarget() * pln.getENHoursFeed());
               Double pnTargetVol = (double) (pln.getPNTargetRate() * pln.getPNHoursFeed());
               Double targetEnergyEN = calculateDeliveredEnergyEN(enTargetVol,Integer.parseInt(pln.getENFormula()));
               Double targetEnergyPN = calculateDeliveredEnergyEN(pnTargetVol,Integer.parseInt(pln.getPNFormula()));
               Double targetProteinEN = calculateDeliveredProteinEN(enTargetVol,Integer.parseInt(pln.getENFormula()));
               Double targetProteinPN = calculateDeliveredEnergyEN(pnTargetVol,Integer.parseInt(pln.getPNFormula()));
               po.setTargetEnergyEN(targetEnergyEN);
               po.setTargetEnergyON(pln.getOralEstimateEnergy());
               po.setTargetEnergyPN(targetEnergyPN);
               po.setTargetProteinEN(targetProteinEN);
               po.setTargetProteinON(pln.getOralEstimateProtein().doubleValue());
               po.setTargetProteinPN(targetProteinPN);
               po.setBowelMovements(rv.getBowelActions().intValue());
               po.setGastricAspirate(rv.getTotalGastricApirateVolume().intValue());
               po.setTargetsDate(pln.getAssesmentDate());
               po.setDeliveredDate(rv.getReviewDate());
               
               if(dict.isEmpty())
               {
                   dict.put(po.getDeliveredDate(),po);
               }
               else
               {
                   if(dict.containsKey(po.getDeliveredDate()))
                   {
                       NutritionPlotObject tmp = (NutritionPlotObject) dict.get(po.getDeliveredDate());
                       double tmpTotalEnergy = tmp.getDeliveredEnergy() + po.getDeliveredEnergy();
                       double tmpTotalProtein = tmp.getDeliveredProtein() + po.getDeliveredProtein();
                       double tmpDeliveredEnergyEN = tmp.getDeliveredEnergyEN() + po.getDeliveredEnergyEN();
                       double tmpDeliveredEnergyPN = tmp.getDeliveredEnergyPN() + po.getDeliveredEnergyPN();
                       double tmpDeliveredEnergyON = tmp.getDeliveredEnergyON() + po.getDeliveredEnergyON();
                       double tmpDeliveredProteinEN = tmp.getDeliveredProteinEN() + po.getDeliveredProteinEN();
                       double tmpDeliveredProteinPN = tmp.getDeliveredProteinPN() + po.getDeliveredProteinPN();
                       double tmpDeliveredProteinON = tmp.getDeliveredProteinON() + po.getDeliveredProteinON();
                       
                       tmp.setDeliveredEnergy(tmpTotalEnergy);
                       tmp.setDeliveredProtein(tmpTotalProtein);
                       tmp.setDeliveredEnergyEN(tmpDeliveredEnergyEN);
                       tmp.setDeliveredEnergyON(tmpDeliveredEnergyON);
                       tmp.setDeliveredEnergyPN(tmpDeliveredEnergyPN);
                       tmp.setDeliveredProteinEN(tmpDeliveredProteinEN);
                       tmp.setDeliveredProteinON(tmpDeliveredProteinON);
                       tmp.setDeliveredProteinPN(tmpDeliveredProteinPN);
                       
                       
                   }
                   else
                   {
                       dict.put(po.getDeliveredDate(), po);
                   }
               }
                
            }
        }
       
        
        return dict;
        
    }
    
    
    public static double calculateDeliveredEnergyEN(final double enReceived,
                                                    final int enFormula)
    {
        
        double enFormulaEnergy = 1;
        
        switch (enFormula) {
            case 1:
                enFormulaEnergy = 4.2;
               break;
            case 2:
                enFormulaEnergy = 4.2;
                break;
            case 3:
                enFormulaEnergy = 4.2;
                break;
            case 4:
                enFormulaEnergy = 4.2;
                break;
            case 5:
                enFormulaEnergy = 4.25;
                break;
            case 6:
                enFormulaEnergy = 6.3;
                break;
            case 7:
                enFormulaEnergy = 5.25;
                break;
            case 8:
                enFormulaEnergy = 6.3;
                break;
            case 9:
                enFormulaEnergy = 8.4;
                break;
            case 10:
                enFormulaEnergy = 6.3;
                break;

        }
        
        return (enReceived/1000)*enFormulaEnergy;
        
    }
    
    public static double calculateDeliveredProteinEN(final double enReceived,
                                                    final int enFormula)
    {
        
        double enFormulaProtein = 1;
        
        switch (enFormula) {
            case 1:
                enFormulaProtein = 40.0;
                break;
            case 2:
                enFormulaProtein = 40.0;
                break;
            case 3:
                enFormulaProtein = 43.0;
                break;
            case 4:
                enFormulaProtein = 40.0;
                break;
            case 5:
                enFormulaProtein = 40.0;
                break;
            case 6:
                enFormulaProtein = 60.0;
                break;
            case 7:
                enFormulaProtein = 63.0;
                break;
            case 8:
                enFormulaProtein = 60.0;
                break;
            case 9:
                enFormulaProtein = 75.0;
                break;
            case 10:
                enFormulaProtein = 68.0;
                break;

        }
        
        return (enReceived/1000)*enFormulaProtein;
        
    }
    
    public static double calculateDeliveredEnergyPN(final double pnReceived,
                                                    final int pnFormula)
    {
        
        double pnFormulaEnergy = 1;
        
        switch (pnFormula) {
            case 1:
                pnFormulaEnergy = 4.2;
                break;
            case 2:
                pnFormulaEnergy = 4.2;
                break;
        }
        
        return (pnReceived/1000)*pnFormulaEnergy;
        
    }
    
    public static double calculateDeliveredProteinPN(final double pnReceived,
                                                    final int pnFormula)
    {
        
        double pnFormulaProtein = 1;
        
        switch (pnFormula) {
            case 1:
                pnFormulaProtein = 50.0;
                break;
            case 2:
                pnFormulaProtein = 70.0;
                break;
        }
        
        return (pnReceived/1000)*pnFormulaProtein;
        
    }
    
    public static double calculateDeliveredEnergyPropofol(final double propofolReceived,
                                                    final int propofolFormula)
    {
        
        double propofolFormulaEnergy = 4.6;
        
        return (propofolReceived/1000)*propofolFormulaEnergy;
        
    }
    
    public static double calculateTotalDailyProtein(final double enTargetRate,
                                             final double enHoursFeed,
                                             final int enFormula,
                                             final double pnTargetRate,
                                             final double pnHoursFeed,
                                             final int pnFormula,
                                             final double onEstimateProtein)
    {
        
        double enProteinProvided = 0.0;
        double pnProteinProvided = 0.0;
        double oralEstimateProtein = 0.0;
        double totalProteinProvided = 0.0;
        double enFormulaProtein = 0.0;
        double pnFormulaProtein = 0.0;
        double enTargetVolume = 0.0;
        double pnTargetVolume = 0.0;
        
        enTargetVolume = enTargetRate * enHoursFeed;
        pnTargetVolume = pnTargetRate * pnHoursFeed;
        
        switch (enFormula) {
            case 1:
                enFormulaProtein = 40.0;
                break;
            case 2:
                enFormulaProtein = 40.0;
                break;
            case 3:
                enFormulaProtein = 43.0;
                break;
            case 4:
                enFormulaProtein = 40.0;
                break;
            case 5:
                enFormulaProtein = 40.0;
                break;
            case 6:
                enFormulaProtein = 60.0;
                break;
            case 7:
                enFormulaProtein = 63.0;
                break;
            case 8:
                enFormulaProtein = 60.0;
                break;
            case 9:
                enFormulaProtein = 75.0;
                break;
            case 10:
                enFormulaProtein = 68.0;
                break;

        }
        
        
        switch (pnFormula) {
            case 1:
                pnFormulaProtein = 50.0;
                break;
            case 2:
                pnFormulaProtein = 70.0;
                break;
        }
        
        enProteinProvided = (enTargetVolume / 1000) * enFormulaProtein;
        pnProteinProvided = (pnTargetVolume/1000) * pnFormulaProtein;
        oralEstimateProtein = onEstimateProtein;
        
        totalProteinProvided = enProteinProvided + pnProteinProvided + oralEstimateProtein;
        
        return totalProteinProvided;
    }
    
    public static double calculateTotalDailyEnergy(final double enTargetRate,
                                             final double enHoursFeed,
                                             final int enFormula,
                                             final double pnTargetRate,
                                             final double pnHoursFeed,
                                             final int pnFormula,
                                             final double onEstimateEnergy,
                                             final double weight,
                                             final String units)
    {
        
         
        double enEnergyProvided = 0.0;
        double pnEnergyProvided = 0.0;
        double totalEnergyProvided = 0.0;
        double enFormulaEnergy = 0.0;
        double pnFormulaEnergy = 0.0;
        double enTargetVolume = 0.0;
        double pnTargetVolume = 0.0;
        
        enTargetVolume = enTargetRate * enHoursFeed;
        pnTargetVolume = pnTargetRate * pnHoursFeed;
        
        switch (enFormula) {
            case 1:
                enFormulaEnergy = 4.2;
               break;
            case 2:
                enFormulaEnergy = 4.2;
                break;
            case 3:
                enFormulaEnergy = 4.2;
                break;
            case 4:
                enFormulaEnergy = 4.2;
                break;
            case 5:
                enFormulaEnergy = 4.25;
                break;
            case 6:
                enFormulaEnergy = 6.3;
                break;
            case 7:
                enFormulaEnergy = 5.25;
                break;
            case 8:
                enFormulaEnergy = 6.3;
                break;
            case 9:
                enFormulaEnergy = 8.4;
                break;
            case 10:
                enFormulaEnergy = 6.3;
                break;

        }
        
        
        switch (pnFormula) {
            case 1:
                pnFormulaEnergy = 4.2;
                break;
            case 2:
                pnFormulaEnergy = 4.2;
                break;
        }
        
        enEnergyProvided = (enTargetVolume/1000)*enFormulaEnergy ;
        pnEnergyProvided = (pnTargetVolume/1000)*pnFormulaEnergy;
        
        totalEnergyProvided = enEnergyProvided + pnEnergyProvided + onEstimateEnergy;
        if(units.equals("KCal"))
            totalEnergyProvided = (totalEnergyProvided*1000)/(4.19*weight);
        
        return totalEnergyProvided;
    }

    public static List<Review> getPrevious5ReviewsForPatient(String PMIID) {
        List<Review> rvs = (List<Review>) getReviewsForICUAdmId(PMIID);
        List<Review> top5 = new ArrayList<Review>();
        Iterator itr = rvs.iterator();
        int cnt = 0;
        while(itr.hasNext())
        {
            if(cnt < 5)
            {
                Review r = (Review) itr.next();
                top5.add(r);
            }
            else
            {
                break;
            }
            cnt++;
        }
       return top5;
    }
    
    public static double getPlanEnergy(Assesmentandplan plan,String sex, int age){
        
        double energyRequired = 0.0;
        energyRequired = calcPlanEnergy(plan, sex, age);
        return energyRequired;
    }
    
     public static double getPlanProtein(Assesmentandplan plan,String sex, int age){
        
    double proteinRequired = 0.0;
       proteinRequired = calcPlanProtein(plan, sex, age);
        return proteinRequired;
    }
    
    public static double calcPlanEnergy(Assesmentandplan plan,String sex, int age){
        double ret = 0.0;
        if(plan.getEquation().equals("Schofield")){
                ret =  calcSchofield(plan, sex, age);
        }
        else if(plan.getEquation().equals("Calorimetry")){
                ret =  plan.getRmr();
        }
        return ret;
    }
    
     public static double calcPlanProtein(Assesmentandplan plan,String sex, int age){
         
         double ret = 0.0;
        
        ret = plan.getAdjustedWeight() * plan.getProteinRequirement();
      return ret;   
    }
     
     
    public static double calcSchofield(Assesmentandplan plan, String sex, int age){
        
        double energyRequired = 0.0;
        double ret = 0.0;
        if(sex.equals("M")){
           if((age >= 10) && (age <= 17)){
                    energyRequired = (2.754 + (0.074 * plan.getAdjustedWeight()));
           }
           else if((age >= 18) && (age <= 29)){
                    energyRequired = (2.896 + (0.063 * plan.getAdjustedWeight()));
           }
           else if((age >= 30) && (age <= 59)){
                    energyRequired = (3.653 + (0.048 * plan.getAdjustedWeight()));
           }
           else if((age >= 60) && (age <= 74)){
                    energyRequired = (2.930 + (0.0499 * plan.getAdjustedWeight()));
           }
           else if (age >= 75){ 	 	     
                    energyRequired = (3.434 + (0.0350 * plan.getAdjustedWeight()));
           }
        }
        else if(sex.equals("F"))
        {
        
         if((age >= 10) && (age <= 17)){
                    energyRequired = (2.898 + (0.056 *  plan.getAdjustedWeight()));
         }
         else if((age >= 18) && (age <= 29))
         {
                    energyRequired = (2.036 + (0.062 *  plan.getAdjustedWeight()));
         }else if((age >= 30) && (age <= 59)){
                    energyRequired = (3.538 + (0.034 *  plan.getAdjustedWeight()));
         }
         else if ((age >= 60) && (age <= 74)){
                    energyRequired = (2.875 + (0.0386 *  plan.getAdjustedWeight()));
         }
        else if (age >= 75){
                    energyRequired = (2.61 + (0.041 *  plan.getAdjustedWeight()));
                    
            }
        }
    
    ret =  (energyRequired * plan.getStressFactor() * plan.getActivityFactor());
    return ret;
        
    }
     


}


