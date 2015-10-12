/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package au.org.alfred.icu.nutrition.webservices.restful;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.Collection;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author miguel
 */
@Entity
@Table(name = "assesmentandplan")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Assesmentandplan.findAll", query = "SELECT a FROM Assesmentandplan a"),
    @NamedQuery(name = "Assesmentandplan.findByAdmId", query = "SELECT a FROM Assesmentandplan a WHERE a.admId = :admId"),
    @NamedQuery(name = "Assesmentandplan.findByAssesmentDate", query = "SELECT a FROM Assesmentandplan a WHERE a.assesmentDate = :assesmentDate"),
    @NamedQuery(name = "Assesmentandplan.findByENComment", query = "SELECT a FROM Assesmentandplan a WHERE a.eNComment = :eNComment"),
    @NamedQuery(name = "Assesmentandplan.findByENFormula", query = "SELECT a FROM Assesmentandplan a WHERE a.eNFormula = :eNFormula"),
    @NamedQuery(name = "Assesmentandplan.findByENHoursFeed", query = "SELECT a FROM Assesmentandplan a WHERE a.eNHoursFeed = :eNHoursFeed"),
    @NamedQuery(name = "Assesmentandplan.findByENPumpBE", query = "SELECT a FROM Assesmentandplan a WHERE a.eNPumpBE = :eNPumpBE"),
    @NamedQuery(name = "Assesmentandplan.findByENTarget", query = "SELECT a FROM Assesmentandplan a WHERE a.eNTarget = :eNTarget"),
    @NamedQuery(name = "Assesmentandplan.findByICUAdmId", query = "SELECT a FROM Assesmentandplan a WHERE a.iCUAdmId = :iCUAdmId"),
    @NamedQuery(name = "Assesmentandplan.findById", query = "SELECT a FROM Assesmentandplan a WHERE a.id = :id"),
    @NamedQuery(name = "Assesmentandplan.findByOralDietCode", query = "SELECT a FROM Assesmentandplan a WHERE a.oralDietCode = :oralDietCode"),
    @NamedQuery(name = "Assesmentandplan.findByOralEstimateEnergy", query = "SELECT a FROM Assesmentandplan a WHERE a.oralEstimateEnergy = :oralEstimateEnergy"),
    @NamedQuery(name = "Assesmentandplan.findByOralEstimateProtein", query = "SELECT a FROM Assesmentandplan a WHERE a.oralEstimateProtein = :oralEstimateProtein"),
    @NamedQuery(name = "Assesmentandplan.findByOralSupplements", query = "SELECT a FROM Assesmentandplan a WHERE a.oralSupplements = :oralSupplements"),
    @NamedQuery(name = "Assesmentandplan.findByPNComment", query = "SELECT a FROM Assesmentandplan a WHERE a.pNComment = :pNComment"),
    @NamedQuery(name = "Assesmentandplan.findByPNFormula", query = "SELECT a FROM Assesmentandplan a WHERE a.pNFormula = :pNFormula"),
    @NamedQuery(name = "Assesmentandplan.findByPNHoursFeed", query = "SELECT a FROM Assesmentandplan a WHERE a.pNHoursFeed = :pNHoursFeed"),
    @NamedQuery(name = "Assesmentandplan.findByPNTargetRate", query = "SELECT a FROM Assesmentandplan a WHERE a.pNTargetRate = :pNTargetRate"),
    @NamedQuery(name = "Assesmentandplan.findByUr", query = "SELECT a FROM Assesmentandplan a WHERE a.ur = :ur"),
    @NamedQuery(name = "Assesmentandplan.findByActivityFactor", query = "SELECT a FROM Assesmentandplan a WHERE a.activityFactor = :activityFactor"),
    @NamedQuery(name = "Assesmentandplan.findByAdjustedCalcMethod", query = "SELECT a FROM Assesmentandplan a WHERE a.adjustedCalcMethod = :adjustedCalcMethod"),
    @NamedQuery(name = "Assesmentandplan.findByAdjustedWeight", query = "SELECT a FROM Assesmentandplan a WHERE a.adjustedWeight = :adjustedWeight"),
    @NamedQuery(name = "Assesmentandplan.findByEquation", query = "SELECT a FROM Assesmentandplan a WHERE a.equation = :equation"),
    @NamedQuery(name = "Assesmentandplan.findByHeightCm", query = "SELECT a FROM Assesmentandplan a WHERE a.heightCm = :heightCm"),
    @NamedQuery(name = "Assesmentandplan.findByHeightEstimateOrActual", query = "SELECT a FROM Assesmentandplan a WHERE a.heightEstimateOrActual = :heightEstimateOrActual"),
    @NamedQuery(name = "Assesmentandplan.findByHeightSource", query = "SELECT a FROM Assesmentandplan a WHERE a.heightSource = :heightSource"),
    @NamedQuery(name = "Assesmentandplan.findByProteinRequirement", query = "SELECT a FROM Assesmentandplan a WHERE a.proteinRequirement = :proteinRequirement"),
    @NamedQuery(name = "Assesmentandplan.findByStressFactor", query = "SELECT a FROM Assesmentandplan a WHERE a.stressFactor = :stressFactor"),
    @NamedQuery(name = "Assesmentandplan.findByWeight", query = "SELECT a FROM Assesmentandplan a WHERE a.weight = :weight"),
    @NamedQuery(name = "Assesmentandplan.findByWeightEstimateOrActual", query = "SELECT a FROM Assesmentandplan a WHERE a.weightEstimateOrActual = :weightEstimateOrActual"),
    @NamedQuery(name = "Assesmentandplan.findByWeightSource", query = "SELECT a FROM Assesmentandplan a WHERE a.weightSource = :weightSource"),
    @NamedQuery(name = "Assesmentandplan.findByAssessmentDietician", query = "SELECT a FROM Assesmentandplan a WHERE a.assessmentDietician = :assessmentDietician"),
    @NamedQuery(name = "Assesmentandplan.findByPNPumpBE", query = "SELECT a FROM Assesmentandplan a WHERE a.pNPumpBE = :pNPumpBE"),
    @NamedQuery(name = "Assesmentandplan.findByProgressToDateHistory", query = "SELECT a FROM Assesmentandplan a WHERE a.progressToDateHistory = :progressToDateHistory"),
    @NamedQuery(name = "Assesmentandplan.findByReferenceRange", query = "SELECT a FROM Assesmentandplan a WHERE a.referenceRange = :referenceRange"),
    @NamedQuery(name = "Assesmentandplan.findByRmr", query = "SELECT a FROM Assesmentandplan a WHERE a.rmr = :rmr"),
    @NamedQuery(name = "Assesmentandplan.findByExtraPlan", query = "SELECT a FROM Assesmentandplan a WHERE a.extraPlan = :extraPlan")})
public class Assesmentandplan implements Serializable {
    private static final long serialVersionUID = 1L;
    @Size(max = 45)
    @Column(name = "AdmId")
    private String admId;
    @Column(name = "AssesmentDate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date assesmentDate;
    @Size(max = 45)
    @Column(name = "ENComment")
    private String eNComment;
    @Size(max = 45)
    @Column(name = "ENFormula")
    private String eNFormula;
    @Column(name = "ENHoursFeed")
    private BigInteger eNHoursFeed;
    @Size(max = 45)
    @Column(name = "ENPumpBE")
    private String eNPumpBE;
    @Column(name = "ENTarget")
    private BigInteger eNTarget;
    @Size(max = 45)
    @Column(name = "ICUAdmId")
    private String iCUAdmId;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "ID")
    private Long id;
    @Size(max = 45)
    @Column(name = "OralDietCode")
    private String oralDietCode;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "OralEstimateEnergy")
    private Double oralEstimateEnergy;
    @Column(name = "OralEstimateProtein")
    private BigInteger oralEstimateProtein;
    @Size(max = 45)
    @Column(name = "OralSupplements")
    private String oralSupplements;
    @Size(max = 45)
    @Column(name = "PNComment")
    private String pNComment;
    @Size(max = 45)
    @Column(name = "PNFormula")
    private String pNFormula;
    @Column(name = "PNHoursFeed")
    private BigInteger pNHoursFeed;
    @Column(name = "PNTargetRate")
    private BigInteger pNTargetRate;
    @Size(max = 45)
    @Column(name = "UR")
    private String ur;
    @Column(name = "activityFactor")
    private Double activityFactor;
    @Size(max = 45)
    @Column(name = "adjustedCalcMethod")
    private String adjustedCalcMethod;
    @Column(name = "adjustedWeight")
    private BigInteger adjustedWeight;
    @Size(max = 45)
    @Column(name = "equation")
    private String equation;
    @Column(name = "heightCm")
    private BigInteger heightCm;
    @Column(name = "heightEstimateOrActual")
    private Boolean heightEstimateOrActual;
    @Size(max = 45)
    @Column(name = "heightSource")
    private String heightSource;
    @Column(name = "proteinRequirement")
    private Double proteinRequirement;
    @Column(name = "stressFactor")
    private Double stressFactor;
    @Column(name = "weight")
    private BigInteger weight;
    @Column(name = "weightEstimateOrActual")
    private Boolean weightEstimateOrActual;
    @Size(max = 45)
    @Column(name = "weightSource")
    private String weightSource;
    @Size(max = 100)
    @Column(name = "assessmentDietician")
    private String assessmentDietician;
    @Size(max = 45)
    @Column(name = "PNPumpBE")
    private String pNPumpBE;
    @Size(max = 1000)
    @Column(name = "progressToDateHistory")
    private String progressToDateHistory;
    @Size(max = 100)
    @Column(name = "referenceRange")
    private String referenceRange;
    @Column(name = "rmr")
    private Double rmr;
    @Column(name = "extraPlan")
    private Boolean extraPlan;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "assesmentandplan")
    private Collection<Review> reviewCollection;

    public Assesmentandplan() {
    }

    public Assesmentandplan(Long id) {
        this.id = id;
    }

    public String getAdmId() {
        return admId;
    }

    public void setAdmId(String admId) {
        this.admId = admId;
    }

    public Date getAssesmentDate() {
        return assesmentDate;
    }

    public void setAssesmentDate(Date assesmentDate) {
        this.assesmentDate = assesmentDate;
    }

    public String getENComment() {
        return eNComment;
    }

    public void setENComment(String eNComment) {
        this.eNComment = eNComment;
    }

    public String getENFormula() {
        return eNFormula;
    }

    public void setENFormula(String eNFormula) {
        this.eNFormula = eNFormula;
    }

    public BigInteger getENHoursFeed() {
        return eNHoursFeed;
    }

    public void setENHoursFeed(BigInteger eNHoursFeed) {
        this.eNHoursFeed = eNHoursFeed;
    }

    public String getENPumpBE() {
        return eNPumpBE;
    }

    public void setENPumpBE(String eNPumpBE) {
        this.eNPumpBE = eNPumpBE;
    }

    public BigInteger getENTarget() {
        return eNTarget;
    }

    public void setENTarget(BigInteger eNTarget) {
        this.eNTarget = eNTarget;
    }

    public String getICUAdmId() {
        return iCUAdmId;
    }

    public void setICUAdmId(String iCUAdmId) {
        this.iCUAdmId = iCUAdmId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOralDietCode() {
        return oralDietCode;
    }

    public void setOralDietCode(String oralDietCode) {
        this.oralDietCode = oralDietCode;
    }

    public Double getOralEstimateEnergy() {
        return oralEstimateEnergy;
    }

    public void setOralEstimateEnergy(Double oralEstimateEnergy) {
        this.oralEstimateEnergy = oralEstimateEnergy;
    }

    public BigInteger getOralEstimateProtein() {
        return oralEstimateProtein;
    }

    public void setOralEstimateProtein(BigInteger oralEstimateProtein) {
        this.oralEstimateProtein = oralEstimateProtein;
    }

    public String getOralSupplements() {
        return oralSupplements;
    }

    public void setOralSupplements(String oralSupplements) {
        this.oralSupplements = oralSupplements;
    }

    public String getPNComment() {
        return pNComment;
    }

    public void setPNComment(String pNComment) {
        this.pNComment = pNComment;
    }

    public String getPNFormula() {
        return pNFormula;
    }

    public void setPNFormula(String pNFormula) {
        this.pNFormula = pNFormula;
    }

    public BigInteger getPNHoursFeed() {
        return pNHoursFeed;
    }

    public void setPNHoursFeed(BigInteger pNHoursFeed) {
        this.pNHoursFeed = pNHoursFeed;
    }

    public BigInteger getPNTargetRate() {
        return pNTargetRate;
    }

    public void setPNTargetRate(BigInteger pNTargetRate) {
        this.pNTargetRate = pNTargetRate;
    }

    public String getUr() {
        return ur;
    }

    public void setUr(String ur) {
        this.ur = ur;
    }

    public Double getActivityFactor() {
        return activityFactor;
    }

    public void setActivityFactor(Double activityFactor) {
        this.activityFactor = activityFactor;
    }

    public String getAdjustedCalcMethod() {
        return adjustedCalcMethod;
    }

    public void setAdjustedCalcMethod(String adjustedCalcMethod) {
        this.adjustedCalcMethod = adjustedCalcMethod;
    }

    public BigInteger getAdjustedWeight() {
        return adjustedWeight;
    }

    public void setAdjustedWeight(BigInteger adjustedWeight) {
        this.adjustedWeight = adjustedWeight;
    }

    public String getEquation() {
        return equation;
    }

    public void setEquation(String equation) {
        this.equation = equation;
    }

    public BigInteger getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(BigInteger heightCm) {
        this.heightCm = heightCm;
    }

    public Boolean getHeightEstimateOrActual() {
        return heightEstimateOrActual;
    }

    public void setHeightEstimateOrActual(Boolean heightEstimateOrActual) {
        this.heightEstimateOrActual = heightEstimateOrActual;
    }

    public String getHeightSource() {
        return heightSource;
    }

    public void setHeightSource(String heightSource) {
        this.heightSource = heightSource;
    }

    public Double getProteinRequirement() {
        return proteinRequirement;
    }

    public void setProteinRequirement(Double proteinRequirement) {
        this.proteinRequirement = proteinRequirement;
    }

    public Double getStressFactor() {
        return stressFactor;
    }

    public void setStressFactor(Double stressFactor) {
        this.stressFactor = stressFactor;
    }

    public BigInteger getWeight() {
        return weight;
    }

    public void setWeight(BigInteger weight) {
        this.weight = weight;
    }

    public Boolean getWeightEstimateOrActual() {
        return weightEstimateOrActual;
    }

    public void setWeightEstimateOrActual(Boolean weightEstimateOrActual) {
        this.weightEstimateOrActual = weightEstimateOrActual;
    }

    public String getWeightSource() {
        return weightSource;
    }

    public void setWeightSource(String weightSource) {
        this.weightSource = weightSource;
    }

    public String getAssessmentDietician() {
        return assessmentDietician;
    }

    public void setAssessmentDietician(String assessmentDietician) {
        this.assessmentDietician = assessmentDietician;
    }

    public String getPNPumpBE() {
        return pNPumpBE;
    }

    public void setPNPumpBE(String pNPumpBE) {
        this.pNPumpBE = pNPumpBE;
    }

    public String getProgressToDateHistory() {
        return progressToDateHistory;
    }

    public void setProgressToDateHistory(String progressToDateHistory) {
        this.progressToDateHistory = progressToDateHistory;
    }

    public String getReferenceRange() {
        return referenceRange;
    }

    public void setReferenceRange(String referenceRange) {
        this.referenceRange = referenceRange;
    }

    public Double getRmr() {
        return rmr;
    }

    public void setRmr(Double rmr) {
        this.rmr = rmr;
    }

    public Boolean getExtraPlan() {
        return extraPlan;
    }

    public void setExtraPlan(Boolean extraPlan) {
        this.extraPlan = extraPlan;
    }

    @XmlTransient
    public Collection<Review> getReviewCollection() {
        return reviewCollection;
    }

    public void setReviewCollection(Collection<Review> reviewCollection) {
        this.reviewCollection = reviewCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Assesmentandplan)) {
            return false;
        }
        Assesmentandplan other = (Assesmentandplan) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "au.org.alfred.icu.nutrition.webservices.restful.Assesmentandplan[ id=" + id + " ]";
    }
    
}
